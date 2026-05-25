/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useEffect, useRef, useState } from "react";
import { useForm, useWatch, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useApplication } from "./application-context";
import { SectionDivider, StepNav } from "./FormFields";
import { Loading } from "@/components/ui/Loading";
import { cn } from "@/lib/utils";
import {
  useGetActiveQuestionnaireQuery,
  useGiveAnswerMutation,
  useFamilyHealthHistoryMutation,
  useAcceptHipaaMutation,
} from "@/redux/api/onboardingApi";
import { HealthDetailsValues, healthDetailsSchema } from "./application";
import { toast } from "sonner";

// ─── API types ────────────────────────────────────────────────────────────────

type NestedQuestion = {
  id: string;
  questionId?: string;
  questionText: string;
  inputLabelText?: string;
  isInputRequired?: boolean;
  isDocumentNeeded?: boolean;
};

type Question = {
  id: string;
  questionText: string;
  category?: string;
  isInputRequired?: boolean;
  isDocumentNeeded?: boolean;
  nestedQuestions?: NestedQuestion[];
  answers?: Array<{
    id: string;
    questionId?: string | null;
    nestedQuestionId?: string | null;
    answerBoolean?: boolean | null;
    inputValue?: string | null;
    documentUrl?: string | null;
  }>;
  familyHistories?: Array<{
    relation?: string | null;
    diagnosis?: string | null;
    approxAgeOfOnset?: number | null;
    ageAtDeath?: number | null;
  }>;
};

type Questionnaire = {
  id: string;
  topicTitle?: string;
  description?: string;
  disclaimerText?: string;
  disclaimerLabel?: string;
  questions?: Question[];
};

// ─── Form value types ─────────────────────────────────────────────────────────

type QuestionAnswer = {
  answer?: "Yes" | "No";
  nested?: Record<string, string>;
  nestedAnswer?: "Yes" | "No";
  nestedInputValue?: string;
  nestedDocumentUrl?: string;
  // CANCER — 2×2 grid (shown only when answer === "Yes")
  cancerRelation?: string;
  cancerDiagnosis?: string;
  cancerAgeOnset?: string;
  cancerAgeAtDeath?: string;
  // TOBACCO nested
  tobaccoCurrentUser?: "Yes" | "No"; // from nested Q1 "If yes, are you a current user?"
  tobaccoLastUsed?: string; // hardcoded follow-up when tobaccoCurrentUser === "No"
};

type HealthStepFormValues = z.infer<typeof healthStepSchema>;

const healthStepSchema = z.object({
  hipaaAcknowledged: z.literal(true, {
    message: "You must acknowledge the HIPAA disclaimer",
  }),
  answers: z.record(z.string(), z.any()),
});

// ─── HIPAA text ───────────────────────────────────────────────────────────────

const HIPAA_TEXT = `We are committed to the secure and confidential collection, use, and storage of client health questionnaire information in full compliance with the Health Insurance Portability and Accountability Act (HIPAA). All health-related data is gathered solely for legitimate administrative purposes and is limited to the minimum necessary information required.

Client information is collected through secure methods and is protected by appropriate administrative, technical, and physical safeguards to prevent unauthorized access, disclosure, alteration, or destruction. Access to protected health information (PHI) is restricted to authorized personnel who are trained in HIPAA compliance and confidentiality practices.

All data is stored in secure systems with encryption and access controls, and any transmission of sensitive information is conducted through secure, HIPAA-compliant channels. We do not share client health information with third parties without explicit authorization, except as required or permitted by law.

We regularly review and update our policies and procedures to maintain compliance with applicable regulations and to ensure the ongoing protection of client privacy and data security.`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normalizeQuestionnaire(response: unknown): Questionnaire | undefined {
  if (!response || typeof response !== "object") return undefined;
  const data =
    "data" in response ? (response as { data?: unknown }).data : response;
  if (!data || typeof data !== "object") return undefined;
  return data as Questionnaire;
}

function toYesNo(value?: boolean | null): "Yes" | "No" | undefined {
  if (value === undefined || value === null) return undefined;
  return value ? "Yes" : "No";
}

function getFirstAnswer(question?: Question) {
  return question?.answers?.[0];
}

function buildDefaultAnswers(
  questionnaire?: Questionnaire,
  saved?: HealthDetailsValues,
  answeredQuestionnaire?: Questionnaire,
): HealthStepFormValues {
  const savedResponses =
    (saved?.responses as Record<string, QuestionAnswer> | undefined) ?? {};

  const answers =
    questionnaire?.questions?.reduce<Record<string, QuestionAnswer>>(
      (acc, q) => {
        const existing = savedResponses[q.id];
        const answeredQuestion = answeredQuestionnaire?.questions?.find(
          (item) => item.id === q.id,
        );
        const topLevelAnswer = getFirstAnswer(answeredQuestion);
        const nestedQuestion = answeredQuestion?.nestedQuestions?.[0];
        const nestedAnswer = getFirstAnswer(nestedQuestion);
        const familyHistory = answeredQuestion?.familyHistories?.[0];

        // For HEALTH questions: backend stores the explanation in topLevelAnswer.inputValue
        // Restore it into nested.explanation so the textarea populates
        const restoredNested: Record<string, string> =
          existing?.nested ??
          (q.category === "HEALTH" && topLevelAnswer?.inputValue
            ? { explanation: topLevelAnswer.inputValue }
            : {});

        // For TOBACCO: nestedAnswer.inputValue is "when did you last use nicotine"
        // and nestedAnswer.answerBoolean is "are you a current user"
        const restoredTobaccoCurrentUser =
          existing?.tobaccoCurrentUser ?? toYesNo(nestedAnswer?.answerBoolean);
        const restoredTobaccoLastUsed =
          existing?.tobaccoLastUsed ?? nestedAnswer?.inputValue ?? "";

        acc[q.id] = {
          answer: existing?.answer ?? toYesNo(topLevelAnswer?.answerBoolean),
          nested: restoredNested,
          nestedAnswer:
            existing?.nestedAnswer ?? toYesNo(nestedAnswer?.answerBoolean),
          nestedInputValue:
            existing?.nestedInputValue ?? nestedAnswer?.inputValue ?? "",
          nestedDocumentUrl:
            existing?.nestedDocumentUrl ?? nestedAnswer?.documentUrl ?? "",
          // CANCER detail fields — restored from FamilyHealthHistory table
          cancerRelation:
              existing?.cancerRelation ?? familyHistory?.relation ?? "",
          cancerDiagnosis:
              existing?.cancerDiagnosis ?? familyHistory?.diagnosis ?? "",
          cancerAgeOnset:
            existing?.cancerAgeOnset ??
              (familyHistory?.approxAgeOfOnset !== undefined && familyHistory?.approxAgeOfOnset !== null
                ? String(familyHistory.approxAgeOfOnset)
                : ""),
          cancerAgeAtDeath:
            existing?.cancerAgeAtDeath ??
              (familyHistory?.ageAtDeath !== undefined && familyHistory?.ageAtDeath !== null
                ? String(familyHistory.ageAtDeath)
                : ""),
          // TOBACCO nested fields
          tobaccoCurrentUser: restoredTobaccoCurrentUser,
          tobaccoLastUsed: restoredTobaccoLastUsed,
        };
        return acc;
      },
      {},
    ) ?? {};

  return {
    hipaaAcknowledged: saved?.hipaaAcknowledged,
    answers,
  } as unknown as HealthStepFormValues;
}

function mapToHealthDetails(
  questionnaire: Questionnaire | undefined,
  answers: Record<string, QuestionAnswer>,
  hipaaAcknowledged: boolean | undefined,
): HealthDetailsValues {
  const cancerQ = questionnaire?.questions?.find(
    (q) => q.category === "CANCER",
  );
  const cancerA = cancerQ ? answers[cancerQ.id] : undefined;

  return {
    hipaaAcknowledged,
    familyCancer: cancerA?.answer,
    cancerDiagnosis: cancerA?.cancerDiagnosis,
    questionnaireId: questionnaire?.id,
    questionnaireTitle: questionnaire?.topicTitle,
    questionnaireDescription: questionnaire?.description,
    responses: answers,
  };
}

// ─── YesNoInline ──────────────────────────────────────────────────────────────

function YesNoInline({
  value,
  onChange,
  name,
  disabled,
}: {
  value?: "Yes" | "No";
  onChange: (v: "Yes" | "No") => void;
  name: string;
  disabled?: boolean;
}) {
  return (
    <RadioGroup
      value={value ?? ""}
      onValueChange={(v) => onChange(v as "Yes" | "No")}
      disabled={disabled}
      className={cn("flex items-center gap-6", disabled && "opacity-50 grayscale-[0.5]")}
    >
      {(["Yes", "No"] as const).map((opt) => (
        <div key={opt} className="flex items-center gap-2">
          <RadioGroupItem
            value={opt}
            id={`${name}-${opt}`}
            className="w-4 h-4 border-gray-300 text-[#5C7FC4]
                       data-[state=checked]:border-[#5C7FC4]
                       data-[state=checked]:bg-[#5C7FC4]"
          />
          <Label
            htmlFor={`${name}-${opt}`}
            className={cn(
              "text-sm text-gray-700 font-normal select-none",
              disabled ? "cursor-not-allowed" : "cursor-pointer"
            )}
          >
            {opt}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}

// ─── Shared input style ───────────────────────────────────────────────────────

const inputCls =
  "h-9 text-sm border-gray-200 rounded-md " +
  "focus-visible:ring-1 focus-visible:ring-[#5C7FC4] focus-visible:border-[#5C7FC4]";

// ─── QuestionBlock ────────────────────────────────────────────────────────────
// Renders one question row with divider, question text, Yes/No radio,
// and any conditional sub-fields.

interface QuestionBlockProps {
  question: Question;
  form: ReturnType<typeof useForm<HealthStepFormValues>>;
  watchedAnswers: Record<string, QuestionAnswer> | undefined;
  disabled?: boolean;
  saveState?: 'saving' | 'saved' | 'error';
}

function QuestionBlock({
  question,
  form,
  watchedAnswers,
  disabled,
  saveState,
}: QuestionBlockProps) {
  const isCANCER = question.category === "CANCER";
  const isHEALTH = question.category === "HEALTH";
  // Tobacco = has nested questions but NOT CANCER
  const isTOBACCO = (question.nestedQuestions?.length ?? 0) > 0 && !isCANCER;

  const answerVal = watchedAnswers?.[question.id]?.answer;

  const tobaccoCurrentUser = watchedAnswers?.[question.id]?.tobaccoCurrentUser;

  // The one nested question from API for tobacco: "If yes, are you a current user?"
  const tobaccoNestedQ = question.nestedQuestions?.[0];

  return (
    <div>
      {/* ── Divider ─────────────────────────────────────────────────── */}
      <div className="border-t border-gray-100 my-5" />

      {/* ── Question text + save indicator ──────────────────────────── */}
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <p className="text-sm text-gray-700 leading-snug">
          {question.questionText}
        </p>
        {saveState === 'saving' && (
          <span className="flex items-center gap-1 text-xs text-blue-500 shrink-0 font-medium">
            <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Saving…
          </span>
        )}
        {saveState === 'saved' && (
          <span className="flex items-center gap-1 text-xs text-emerald-600 shrink-0 font-medium">
            <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Saved
          </span>
        )}
        {saveState === 'error' && (
          <span className="flex items-center gap-1 text-xs text-red-500 shrink-0 font-medium">
            <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            Failed to save
          </span>
        )}
      </div>

      {/* ── Top-level Yes / No ──────────────────────────────────────── */}
      <Controller
        control={form.control}
        name={`answers.${question.id}.answer`}
        render={({ field }) => (
          <YesNoInline
            name={`q-${question.id}`}
            value={field.value}
            onChange={field.onChange}
            disabled={disabled}
          />
        )}
      />

      {/* ══════════════════════════════════════════════════════════════
          HEALTH: textarea explanation when answer = Yes
      ══════════════════════════════════════════════════════════════ */}
      {isHEALTH && answerVal === "Yes" && (
        <div className="mt-3">
          <p className="text-xs text-gray-400 mb-1.5">
            If yes, please explain including dates of diagnosis:
          </p>
          <Controller
            control={form.control}
            name={`answers.${question.id}.nested.explanation`}
            render={({ field }) => (
              <Textarea
                {...field}
                rows={3}
                disabled={disabled}
                placeholder="Diagnosed with early-stage condition in Jan 2022. Currently undergoing routine monitoring."
                className={cn(
                  "w-full border border-gray-200 rounded-lg text-sm text-gray-700 placeholder:text-gray-400 resize-none focus-visible:ring-1 focus-visible:ring-[#5C7FC4] focus-visible:border-[#5C7FC4]",
                  disabled && "opacity-50 cursor-not-allowed bg-gray-50"
                )}
              />
            )}
          />
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          CANCER: 2×2 input grid — shown only when answer = Yes
      ══════════════════════════════════════════════════════════════ */}
      {isCANCER && answerVal === "Yes" && (
        <div className="mt-4 flex flex-col gap-3">
          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-gray-500 font-normal">
                Relation (mother, father, brother, sister)
              </Label>
              <Controller
                control={form.control}
                name={`answers.${question.id}.cancerRelation`}
                render={({ field }) => (
                  <Input {...field} disabled={disabled} className={cn(inputCls, disabled && "opacity-50 cursor-not-allowed bg-gray-50")} />
                )}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-gray-500 font-normal">
                Diagnosis
              </Label>
              <Controller
                control={form.control}
                name={`answers.${question.id}.cancerDiagnosis`}
                render={({ field }) => (
                  <Input {...field} disabled={disabled} className={cn(inputCls, disabled && "opacity-50 cursor-not-allowed bg-gray-50")} />
                )}
              />
            </div>
          </div>
          {/* Row 2 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-gray-500 font-normal">
                Approximate age of disease onset
              </Label>
              <Controller
                control={form.control}
                name={`answers.${question.id}.cancerAgeOnset`}
                render={({ field }) => (
                  <Input
                    {...field}
                    disabled={disabled}
                    type="number"
                    inputMode="numeric"
                    pattern="\\d*"
                    min={0}
                    step={1}
                    onKeyDown={(e) => {
                      // Prevent non-numeric characters like 'e', '+', '-', and '.'
                      if (e.key === "e" || e.key === "+" || e.key === "-" || e.key === ".") {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e) => {
                      const paste = e.clipboardData.getData("text");
                      if (!/^\d+$/.test(paste)) e.preventDefault();
                    }}
                    className={cn(inputCls, disabled && "opacity-50 cursor-not-allowed bg-gray-50")}
                  />
                )}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-gray-500 font-normal">
                Age at death (if deceased)
              </Label>
              <Controller
                control={form.control}
                name={`answers.${question.id}.cancerAgeAtDeath`}
                render={({ field }) => (
                  <Input
                    {...field}
                    disabled={disabled}
                    type="number"
                    inputMode="numeric"
                    pattern="\\d*"
                    min={0}
                    step={1}
                    onKeyDown={(e) => {
                      if (e.key === "e" || e.key === "+" || e.key === "-" || e.key === ".") {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e) => {
                      const paste = e.clipboardData.getData("text");
                      if (!/^\d+$/.test(paste)) e.preventDefault();
                    }}
                    className={cn(inputCls, disabled && "opacity-50 cursor-not-allowed bg-gray-50")}
                  />
                )}
              />
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          TOBACCO nested logic:

          Top-level answer = Yes →
            Show nested Q from API: "If yes, are you a current user?" (Yes/No radio)
              tobaccoCurrentUser = Yes  → nothing more
              tobaccoCurrentUser = No   → show hardcoded text input:
                                          "If no, when did you last use nicotine products?"
      ══════════════════════════════════════════════════════════════ */}
      {isTOBACCO && answerVal === "Yes" && tobaccoNestedQ && (
        <div className="mt-4 border-l-2 border-gray-100 pl-4 flex flex-col gap-3">
          {/* "If yes, are you a current user?" → Yes/No radio */}
          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-600 leading-snug">
              {tobaccoNestedQ.questionText}
            </p>
            <Controller
              control={form.control}
              name={`answers.${question.id}.tobaccoCurrentUser`}
              render={({ field }) => (
                <YesNoInline
                  name={`tobacco-current-${question.id}`}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              )}
            />
          </div>

          {/* "If no, when did you last use nicotine products?" */}
          {/* Shown only when tobaccoCurrentUser = No */}
          {tobaccoCurrentUser === "No" && (
            <div className="flex flex-col gap-1.5">
              <p className="text-sm text-gray-600 leading-snug">
                If no, when did you last use nicotine products?
              </p>
              <Controller
                control={form.control}
                name={`answers.${question.id}.tobaccoLastUsed`}
                render={({ field }) => (
                  <Input
                    {...field}
                    disabled={disabled}
                    placeholder="August 2019"
                    className={cn(inputCls, disabled && "opacity-50 cursor-not-allowed bg-gray-50")}
                  />
                )}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main StepHealthDetails ───────────────────────────────────────────────────

export function StepHealthDetails({
  MyGivenAnswareQuestionnaire,
  applicationId,
  hipaaAccepted,
}: {
  MyGivenAnswareQuestionnaire?: any;
  applicationId?: string;
  hipaaAccepted?: boolean;
}) {
  const { data, saveHealthDetails, nextStep, prevStep } = useApplication();
  const router = useRouter();
  const { data: questionnaireResponse, isLoading } =
    useGetActiveQuestionnaireQuery(undefined);
  const questionnaire = normalizeQuestionnaire(questionnaireResponse);

  // ── Stable initial values ──────────────────────────────────────────────────
  // We compute defaultValues ONCE from the first non-empty load of BOTH the
  // questionnaire template AND the user's existing answers.
  // After that, updates (from giveAnswer cache invalidation) don't re-derive
  // defaults — preventing form.reset from wiping answers mid-save.
  const initializedRef = useRef(false);
  const stableDefaultsRef = useRef<HealthStepFormValues | null>(null);

  // Key that changes when EITHER the questionnaire template OR real answer data arrives.
  // Using total answer count means the key changes when backend answers load in.
  const answeredQuestionnaire = normalizeQuestionnaire(MyGivenAnswareQuestionnaire);
  const totalAnswerCount = answeredQuestionnaire?.questions?.reduce(
    (sum, q) => sum + (q.answers?.length ?? 0) + (q.familyHistories?.length ?? 0),
    0
  ) ?? 0;
  const answerDataKey = questionnaire?.id
    ? `${questionnaire.id}:${totalAnswerCount}`
    : null;

  const defaultValues = useMemo(() => {
    // Only compute once — when both questionnaire template and answer data are available
    if (!initializedRef.current && questionnaire) {
      const defaults = buildDefaultAnswers(
        questionnaire,
        data.healthDetails,
        answeredQuestionnaire,
      );
      if (defaults.hipaaAcknowledged === undefined && hipaaAccepted !== undefined) {
        defaults.hipaaAcknowledged = hipaaAccepted as any;
      }
      stableDefaultsRef.current = defaults;
      initializedRef.current = true;
      return defaults;
    }
    // Return already-frozen defaults (won't change on subsequent refetches)
    return stableDefaultsRef.current ?? buildDefaultAnswers(questionnaire, data.healthDetails, undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answerDataKey]); // Re-derive only when key changes (new questionnaire or new answer count)

  const form = useForm<HealthStepFormValues>({
    resolver: zodResolver(healthStepSchema),
    defaultValues,
    mode: "onChange",
  });

  // Reset form ONCE when questionnaire first loads — not on every refetch
  const hasResetRef = useRef(false);
  useEffect(() => {
    if (!questionnaire || hasResetRef.current) return;
    form.reset(defaultValues);
    hasResetRef.current = true;
  }, [questionnaire, form, defaultValues]);


  const watchedAnswers = useWatch({ control: form.control, name: "answers" });
  const isAcknowledged = useWatch({
    control: form.control,
    name: "hipaaAcknowledged",
  });
  const isDisabled = isAcknowledged !== true;

  const [giveAnswer] = useGiveAnswerMutation();
  const [familyHealthHistory] = useFamilyHealthHistoryMutation();
  const [acceptHipaa] = useAcceptHipaaMutation();

  // Track save states per question: 'saving' | 'saved' | 'error' | undefined
  const [saveStates, setSaveStates] = useState<Record<string, 'saving' | 'saved' | 'error'>>({})

  const disclaimerText =
    questionnaire?.disclaimerText ||
    (MyGivenAnswareQuestionnaire as any)?.disclaimerText ||
    HIPAA_TEXT;
  const disclaimerLabel =
    questionnaire?.disclaimerLabel ||
    (MyGivenAnswareQuestionnaire as any)?.disclaimerLabel ||
    "I acknowledge that I have read, understood, and agree to the Encore LLC HIPAA disclaimer";

  // HIPAA acceptance saving state
  const [isSavingHipaa, setIsSavingHipaa] = useState(false);

  const handleHipaaChange = async (checked: boolean) => {
    form.setValue("hipaaAcknowledged", checked ? true : undefined as any, {
      shouldValidate: true,
      shouldDirty: true,
    });

    if (applicationId) {
      setIsSavingHipaa(true);
      try {
        await acceptHipaa({
          applicationId,
          hipaaAccepted: checked,
        }).unwrap();
        // Also update local application context state
        const values = form.getValues();
        const mapped = mapToHealthDetails(
          questionnaire,
          values.answers,
          checked as any,
        );
        saveHealthDetails(mapped);
      } catch (err) {
        console.error("Failed to update HIPAA acceptance in DB:", err);
        toast.error("Failed to save HIPAA acceptance. Please try again.");
      } finally {
        setIsSavingHipaa(false);
      }
    }
  };
  const previousAnswersRef = useRef<Record<string, QuestionAnswer> | undefined>(
    undefined,
  );

  // Effect to auto-save only CHANGED answers with debounce + save indicator
  useEffect(() => {
    if (!applicationId || !questionnaire?.id || !watchedAnswers) return;

    const timer = setTimeout(async () => {
      // Find which questions actually changed
      const prevAnswers = previousAnswersRef.current ?? {};
      const changedQuestionIds: string[] = [];

      for (const [questionId, currentAnswer] of Object.entries(watchedAnswers)) {
        const prevAnswer = prevAnswers[questionId];

        if (
          prevAnswer?.answer !== currentAnswer?.answer ||
          prevAnswer?.nested?.explanation !== currentAnswer?.nested?.explanation ||
          prevAnswer?.cancerDiagnosis !== currentAnswer?.cancerDiagnosis ||
          prevAnswer?.cancerRelation !== currentAnswer?.cancerRelation ||
          prevAnswer?.cancerAgeOnset !== currentAnswer?.cancerAgeOnset ||
          prevAnswer?.cancerAgeAtDeath !== currentAnswer?.cancerAgeAtDeath ||
          prevAnswer?.tobaccoCurrentUser !== currentAnswer?.tobaccoCurrentUser ||
          prevAnswer?.tobaccoLastUsed !== currentAnswer?.tobaccoLastUsed
        ) {
          changedQuestionIds.push(questionId);
        }
      }

      if (changedQuestionIds.length === 0) return;

      // Mark changed questions as 'saving'
      setSaveStates(prev => {
        const next = { ...prev };
        changedQuestionIds.forEach(id => { next[id] = 'saving'; });
        return next;
      });

      // Submit only changed answers
      const errors: string[] = [];
      for (const questionId of changedQuestionIds) {
        const answer = watchedAnswers[questionId];
        const q = questionnaire.questions?.find((x) => x.id === questionId);
        if (!q) continue;

        // Send main answer (boolean only — for CANCER do NOT send inputValue here,
        // cancer details go to FamilyHealthHistory table, not HealthAnswer)
        if (answer?.answer !== undefined) {
          try {
            await giveAnswer({
              applicationId,
              questionnaireId: questionnaire.id,
              questionId,
              answerBoolean: answer.answer === "Yes",
              // Persist non-cancer explanation directly in HealthAnswer.
              inputValue: q.category !== "CANCER"
                ? ((answer.nested?.explanation as string) || undefined)
                : undefined,
            }).unwrap();
          } catch (e) {
            console.error("giveAnswer error", e);
            errors.push(questionId);
          }
        }

        // Send nested tobacco answer
        if (q.nestedQuestions?.[0] && answer?.tobaccoCurrentUser !== undefined) {
          try {
            await giveAnswer({
              applicationId,
              questionnaireId: questionnaire.id,
              nestedQuestionId: q.nestedQuestions[0].id,
              answerBoolean: answer.tobaccoCurrentUser === "Yes",
              inputValue: answer.tobaccoLastUsed || undefined,
            }).unwrap();
          } catch (e) {
            console.error("giveAnswer nested error", e);
          }
        }

        if (
          q.category === "CANCER" &&
          answer?.answer === "Yes" &&
          (answer.cancerRelation !== undefined ||
            answer.cancerDiagnosis !== undefined ||
            answer.cancerAgeOnset !== undefined ||
            answer.cancerAgeAtDeath !== undefined)
        ) {
          try {
            // Validate numeric-only ages (prevent accidental text)
            const onsetVal = answer.cancerAgeOnset;
            const deathVal = answer.cancerAgeAtDeath;
            if (onsetVal && !/^\d+$/.test(String(onsetVal))) {
              toast.error("Approximate age of onset must be a number");
              errors.push(questionId);
            } else if (deathVal && !/^\d+$/.test(String(deathVal))) {
              toast.error("Age at death must be a number");
              errors.push(questionId);
            } else {
              await familyHealthHistory({
                applicationId,
                questionId,
                relation: answer.cancerRelation?.trim() || "",
                diagnosis: answer.cancerDiagnosis?.trim() || undefined,
                approxAgeOfOnset: answer.cancerAgeOnset ? parseInt(String(answer.cancerAgeOnset), 10) : undefined,
                ageAtDeath: answer.cancerAgeAtDeath ? parseInt(String(answer.cancerAgeAtDeath), 10) : undefined,
              }).unwrap();
            }
          } catch (e) {
            console.error("familyHealthHistory error", e);
            errors.push(questionId);
          }
        }

      }

      // Update save states: saved or error per question
      setSaveStates(prev => {
        const next = { ...prev };
        changedQuestionIds.forEach(id => {
          next[id] = errors.includes(id) ? 'error' : 'saved';
        });
        return next;
      });

      // Clear 'saved' indicators after 2.5s
      setTimeout(() => {
        setSaveStates(prev => {
          const next = { ...prev };
          changedQuestionIds.forEach(id => {
            if (next[id] === 'saved') delete next[id];
          });
          return next;
        });
      }, 2500);

      // Update reference for next comparison
      previousAnswersRef.current = JSON.parse(JSON.stringify(watchedAnswers));
    }, 900);

    return () => clearTimeout(timer);
  }, [
    watchedAnswers,
    applicationId,
    questionnaire,
    giveAnswer,
    familyHealthHistory,
  ]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loading />
      </div>
    );
  }

  const onSubmit = (values: HealthStepFormValues) => {
    if (values.hipaaAcknowledged !== true) {
      toast.error("Please acknowledge the HIPAA disclaimer before continuing.");
      return;
    }
    const mapped = mapToHealthDetails(
      questionnaire,
      values.answers,
      values.hipaaAcknowledged,
    );
    saveHealthDetails(mapped);
    nextStep();
  };

  const handleSaveExit = () => {
    const values = form.getValues();
    const mapped = mapToHealthDetails(
      questionnaire,
      values.answers,
      values.hipaaAcknowledged,
    );
    saveHealthDetails(mapped);
    router.push("/"); // Redirect to dashboard/home
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* ── HIPAA ──────────────────────────────────────────────────── */}
        <div className="mb-6">
          <div className="text-xs text-gray-600 leading-relaxed whitespace-pre-line mb-4">
            {disclaimerText}
          </div>

          <FormField
            control={form.control}
            name="hipaaAcknowledged"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <div className="flex items-start gap-3 border border-gray-200 rounded-lg px-4 py-3 bg-gray-50/50">
                  <FormControl>
                    <Checkbox
                      checked={field.value === true}
                      disabled={isSavingHipaa}
                      onCheckedChange={(checked) => {
                        const isChecked = checked === true;
                        field.onChange(isChecked ? true : undefined);
                        handleHipaaChange(isChecked);
                      }}
                      className="mt-0.5 border-gray-400
                                 data-[state=checked]:bg-[#5C7FC4]
                                 data-[state=checked]:border-[#5C7FC4]"
                    />
                  </FormControl>
                  <div className="flex-1 flex items-start justify-between gap-2">
                    <Label className="text-sm text-gray-700 font-medium cursor-pointer leading-snug">
                      {disclaimerLabel}
                    </Label>
                    {isSavingHipaa && (
                      <span className="flex items-center gap-1 text-xs text-blue-500 shrink-0 font-medium">
                        <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Saving…
                      </span>
                    )}
                  </div>
                </div>
                <FormMessage className="text-xs text-red-500 mt-1" />
              </FormItem>
            )}
          />
        </div>

        <SectionDivider />

        {/* ── Questionnaire header ────────────────────────────────────── */}
        <div className="mt-5 mb-1">
          <h2 className="text-base font-bold text-gray-800">
            Step 2: {questionnaire?.topicTitle ?? "Health Questionnaire"}
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {questionnaire?.description ??
              "Please provide information about your medical and family history. This helps us tailor the plan for you."}
          </p>
        </div>

        {/* ── Questions ──────────────────────────────────────────────── */}
        {questionnaire?.questions?.length ? (
          questionnaire.questions.map((question) => (
            <QuestionBlock
              key={question.id}
              question={question}
              form={form}
              watchedAnswers={watchedAnswers}
              disabled={isDisabled}
              saveState={saveStates[question.id]}
            />
          ))
        ) : (
          <p className="text-sm text-gray-500 mt-4">
            No active questionnaire is available right now.
          </p>
        )}

        {/* Final divider */}
        <div className="border-t border-gray-100 mt-5" />

        <StepNav
          onBack={prevStep}
          backLabel="← Back to Personal Info"
          onSaveExit={handleSaveExit}
          onNext={nextStep}
          nextLabel="Dog Information →"
          isSubmitting={form.formState.isSubmitting}
        />
      </form>
    </Form>
  );
}
