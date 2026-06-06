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
  useGetAnswerByNestedQuestionQuery,
  useGetFamilyHealthHistoryByApplicationQuery,
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
  answers?: Array<{
    id: string;
    questionId?: string | null;
    nestedQuestionId?: string | null;
    answerBoolean?: boolean | null;
    inputValue?: string | null;
    documentUrl?: string | null;
  }>;
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
  // GENERIC NESTED
  nestedAnswers?: Record<
    string,
    {
      answer?: "Yes" | "No";
      value?: string;
    }
  >;
};

type SavedAnswerRecord = {
  answerBoolean?: boolean | null;
  inputValue?: string | null;
  documentUrl?: string | null;
  updatedAt?: string;
};

type SavedFamilyHistoryRecord = {
  id?: string;
  applicationId?: string;
  userId?: string;
  questionId?: string;
  relation?: string | null;
  diagnosis?: string | null;
  approxAgeOfOnset?: number | null;
  ageAtDeath?: number | null;
  updatedAt?: string;
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

function normalizeData<T>(response: unknown): T | undefined {
  if (!response || typeof response !== "object") return undefined;
  const data = "data" in response ? (response as { data?: unknown }).data : response;
  return data as T | undefined;
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
  nestedAnswer?: SavedAnswerRecord,
  familyHistories?: SavedFamilyHistoryRecord[],
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
        const nestedQuestionAnswer = nestedAnswer ?? getFirstAnswer(nestedQuestion);
        const qFamilyHistory = familyHistories?.find((fh) => fh.questionId === q.id);

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
          existing?.tobaccoCurrentUser ?? toYesNo(nestedQuestionAnswer?.answerBoolean);
        const restoredTobaccoLastUsed =
          existing?.tobaccoLastUsed ?? nestedQuestionAnswer?.inputValue ?? "";

        // For general nested questions
        const nestedAnswers: Record<string, { answer?: "Yes" | "No"; value?: string }> = {};
        q.nestedQuestions?.forEach((nq) => {
          const answeredQuestion = answeredQuestionnaire?.questions?.find(
            (item) => item.id === q.id,
          );
          const answeredNestedQ = answeredQuestion?.nestedQuestions?.find(
            (item: any) => item.id === nq.id,
          );
          const ans = answeredNestedQ?.answers?.[0];
          nestedAnswers[nq.id] = {
            answer: existing?.nestedAnswers?.[nq.id]?.answer ?? toYesNo(ans?.answerBoolean),
            value: existing?.nestedAnswers?.[nq.id]?.value ?? ans?.inputValue ?? "",
          };
        });

        acc[q.id] = {
          answer: existing?.answer ?? toYesNo(topLevelAnswer?.answerBoolean),
          nested: restoredNested,
          nestedAnswer:
            existing?.nestedAnswer ?? toYesNo(nestedQuestionAnswer?.answerBoolean),
          nestedInputValue:
            existing?.nestedInputValue ?? nestedQuestionAnswer?.inputValue ?? "",
          nestedDocumentUrl:
            existing?.nestedDocumentUrl ?? nestedQuestionAnswer?.documentUrl ?? "",
          // CANCER detail fields — restore from saved form state or matching family-history answer
          cancerRelation:
            existing?.cancerRelation ?? qFamilyHistory?.relation ?? "",
          cancerDiagnosis:
            existing?.cancerDiagnosis ?? qFamilyHistory?.diagnosis ?? "",
          cancerAgeOnset:
            existing?.cancerAgeOnset ??
            (qFamilyHistory?.approxAgeOfOnset !== undefined && qFamilyHistory?.approxAgeOfOnset !== null
              ? String(qFamilyHistory.approxAgeOfOnset)
              : ""),
          cancerAgeAtDeath:
            existing?.cancerAgeAtDeath ??
            (qFamilyHistory?.ageAtDeath !== undefined && qFamilyHistory?.ageAtDeath !== null
              ? String(qFamilyHistory.ageAtDeath)
              : ""),
          // TOBACCO nested fields
          tobaccoCurrentUser: restoredTobaccoCurrentUser,
          tobaccoLastUsed: restoredTobaccoLastUsed,
          // GENERIC NESTED
          nestedAnswers,
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
  const isTOBACCO = (question.questionText.toLowerCase().includes("tobacco") || question.questionText.toLowerCase().includes("nicotine")) && (question.nestedQuestions?.length ?? 0) > 0;
  const isGENERIC_NESTED = (question.nestedQuestions?.length ?? 0) > 0 && !isCANCER && !isTOBACCO;

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
              tobaccoCurrentUser = Yes  → show hardcoded text input:
                                          "If yes, when did you last use nicotine products?"
              tobaccoCurrentUser = No   → nothing more
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

          {/* "If yes, when did you last use nicotine products?" */}
          {/* Shown only when tobaccoCurrentUser = Yes */}
          {tobaccoCurrentUser === "Yes" && (
            <div className="flex flex-col gap-1.5">
              <p className="text-sm text-gray-600 leading-snug">
                If yes, when did you last use nicotine products?
              </p>
              <Controller
                control={form.control}
                name={`answers.${question.id}.tobaccoLastUsed`}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="date"
                    disabled={disabled}
                    className={cn(inputCls, disabled && "opacity-50 cursor-not-allowed bg-gray-50")}
                  />
                )}
              />
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          GENERIC NESTED questions block:
          Shown only when parent answer = Yes
      ══════════════════════════════════════════════════════════════ */}
      {isGENERIC_NESTED && answerVal === "Yes" && question.nestedQuestions && (
        <div className="mt-4 border-l-2 border-gray-100 pl-4 flex flex-col gap-4">
          {question.nestedQuestions.map((nestedQ) => {
            return (
              <div key={nestedQ.id} className="flex flex-col gap-3">
                {/* Nested Question Text */}
                <p className="text-sm text-gray-600 leading-snug">
                  {nestedQ.questionText}
                </p>

                {/* Yes/No Radio or Text Input depending on isInputRequired */}
                {!nestedQ.isInputRequired ? (
                  <Controller
                    control={form.control}
                    name={`answers.${question.id}.nestedAnswers.${nestedQ.id}.answer`}
                    render={({ field }) => (
                      <YesNoInline
                        name={`nested-${nestedQ.id}`}
                        value={field.value}
                        onChange={field.onChange}
                        disabled={disabled}
                      />
                    )}
                  />
                ) : (
                  <Controller
                    control={form.control}
                    name={`answers.${question.id}.nestedAnswers.${nestedQ.id}.value`}
                    render={({ field }) => (
                      <Input
                        {...field}
                        disabled={disabled}
                        placeholder="Enter details..."
                        className={cn(inputCls, disabled && "opacity-50 cursor-not-allowed bg-gray-50")}
                      />
                    )}
                  />
                )}
              </div>
            );
          })}
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
  const cancerQuestion = questionnaire?.questions?.find((q) => q.category === "CANCER");
  const tobaccoQuestion = questionnaire?.questions?.find((q) => (q.nestedQuestions?.length ?? 0) > 0);
  const nestedQuestionId = tobaccoQuestion?.nestedQuestions?.[0]?.id;

  const {
    data: nestedAnswerResponse,
    isLoading: isLoadingNestedAnswer,
    isFetching: isFetchingNestedAnswer,
  } = useGetAnswerByNestedQuestionQuery(
    {
      applicationId: applicationId ?? "",
      nestedQuestionId: nestedQuestionId ?? "",
    },
    { skip: !applicationId || !nestedQuestionId },
  );

  const {
    data: familyHistoryResponse,
    isLoading: isLoadingFamilyHistory,
    isFetching: isFetchingFamilyHistory,
  } = useGetFamilyHealthHistoryByApplicationQuery(
    applicationId ?? "",
    { skip: !applicationId },
  );

  const nestedQuestionAnswer = normalizeData<SavedAnswerRecord>(nestedAnswerResponse);
  const familyHistoryData = normalizeData<SavedFamilyHistoryRecord | SavedFamilyHistoryRecord[]>(familyHistoryResponse);
  const familyHistoryRecords = Array.isArray(familyHistoryData)
    ? familyHistoryData
    : familyHistoryData
      ? [familyHistoryData]
      : [];

  const familyHistoryDeps = useMemo(() => {
    return JSON.stringify(
      familyHistoryRecords.map((r) => ({
        id: r.questionId,
        relation: r.relation,
        diagnosis: r.diagnosis,
        onset: r.approxAgeOfOnset,
        death: r.ageAtDeath,
        updated: r.updatedAt,
      }))
    );
  }, [familyHistoryRecords]);

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
    ? `${questionnaire.id}:${totalAnswerCount}:${nestedQuestionAnswer?.updatedAt ?? ""}:${familyHistoryDeps}`
    : null;
  const canHydrateDefaults = !!questionnaire
    && (!nestedQuestionId || (!isLoadingNestedAnswer && !isFetchingNestedAnswer))
    && (!cancerQuestion?.id || (!isLoadingFamilyHistory && !isFetchingFamilyHistory));

  const defaultValues = useMemo(() => {
    // Only compute once — when both questionnaire template and answer data are available
    if (!initializedRef.current && questionnaire && canHydrateDefaults) {
      const defaults = buildDefaultAnswers(
        questionnaire,
        data.healthDetails,
        answeredQuestionnaire,
        nestedQuestionAnswer,
        familyHistoryRecords,
      );
      if (defaults.hipaaAcknowledged === undefined && hipaaAccepted !== undefined) {
        defaults.hipaaAcknowledged = hipaaAccepted as any;
      }
      stableDefaultsRef.current = defaults;
      initializedRef.current = true;
      return defaults;
    }
    // Return already-frozen defaults (won't change on subsequent refetches)
    const fallback = stableDefaultsRef.current ?? buildDefaultAnswers(questionnaire, data.healthDetails, undefined, nestedQuestionAnswer, familyHistoryRecords);
    if (fallback.hipaaAcknowledged === undefined && hipaaAccepted !== undefined) {
      fallback.hipaaAcknowledged = hipaaAccepted as any;
    }
    return fallback;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answerDataKey, canHydrateDefaults, hipaaAccepted]); // Re-derive only when the latest saved answer records change

  const form = useForm<HealthStepFormValues>({
    resolver: zodResolver(healthStepSchema),
    defaultValues,
    mode: "onChange",
  });

  // Reset form ONCE when questionnaire first loads — not on every refetch
  const hasResetRef = useRef(false);
  useEffect(() => {
    if (!questionnaire || hasResetRef.current || !canHydrateDefaults) return;
    form.reset(defaultValues);
    previousAnswersRef.current = JSON.parse(
      JSON.stringify(defaultValues.answers ?? {}),
    );
    hasResetRef.current = true;
  }, [questionnaire, form, defaultValues, canHydrateDefaults]);

  useEffect(() => {
    if (!questionnaire?.questions?.length || !familyHistoryRecords.length) return;

    console.log("[StepHealthDetails] family histories loaded/updated", {
      applicationId,
      recordsCount: familyHistoryRecords.length,
    });

    const cancerQuestions = questionnaire.questions.filter((q) => q.category === "CANCER");
    let hasChanges = false;
    const prevAnswers = previousAnswersRef.current ?? {};
    const updatedPrevAnswers = { ...prevAnswers };

    cancerQuestions.forEach((cancerQ) => {
      const qFamilyHistory = familyHistoryRecords.find((fh) => fh.questionId === cancerQ.id);
      if (!qFamilyHistory) return;

      const currentAnswer = form.getValues(`answers.${cancerQ.id}`) as QuestionAnswer | undefined;
      const currentRelation = currentAnswer?.cancerRelation ?? "";
      const currentDiagnosis = currentAnswer?.cancerDiagnosis ?? "";
      const currentAgeOnset = currentAnswer?.cancerAgeOnset ?? "";
      const currentAgeAtDeath = currentAnswer?.cancerAgeAtDeath ?? "";

      const nextRelation = qFamilyHistory.relation ?? "";
      const nextDiagnosis = qFamilyHistory.diagnosis ?? "";
      const nextAgeOnset = qFamilyHistory.approxAgeOfOnset !== undefined && qFamilyHistory.approxAgeOfOnset !== null
        ? String(qFamilyHistory.approxAgeOfOnset)
        : "";
      const nextAgeAtDeath = qFamilyHistory.ageAtDeath !== undefined && qFamilyHistory.ageAtDeath !== null
        ? String(qFamilyHistory.ageAtDeath)
        : "";

      if (
        currentRelation !== nextRelation ||
        currentDiagnosis !== nextDiagnosis ||
        currentAgeOnset !== nextAgeOnset ||
        currentAgeAtDeath !== nextAgeAtDeath
      ) {
        form.setValue(`answers.${cancerQ.id}.cancerRelation`, nextRelation, { shouldDirty: false, shouldValidate: false });
        form.setValue(`answers.${cancerQ.id}.cancerDiagnosis`, nextDiagnosis, { shouldDirty: false, shouldValidate: false });
        form.setValue(`answers.${cancerQ.id}.cancerAgeOnset`, nextAgeOnset, { shouldDirty: false, shouldValidate: false });
        form.setValue(`answers.${cancerQ.id}.cancerAgeAtDeath`, nextAgeAtDeath, { shouldDirty: false, shouldValidate: false });

        updatedPrevAnswers[cancerQ.id] = {
          ...(updatedPrevAnswers[cancerQ.id] || {}),
          cancerRelation: nextRelation,
          cancerDiagnosis: nextDiagnosis,
          cancerAgeOnset: nextAgeOnset,
          cancerAgeAtDeath: nextAgeAtDeath,
        };
        hasChanges = true;
      }
    });

    if (hasChanges) {
      previousAnswersRef.current = updatedPrevAnswers;
    }
  }, [questionnaire, familyHistoryDeps]);


  const watchedAnswers = useWatch({ control: form.control, name: "answers" });
  const isAcknowledged = useWatch({
    control: form.control,
    name: "hipaaAcknowledged",
  });
  const isDisabled = isAcknowledged !== true;

  // Log all frontend data to console
  useEffect(() => {
    console.log("[StepHealthDetails] Data State in Frontend:", {
      applicationId,
      questionnaire,
      MyGivenAnswareQuestionnaire,
      familyHistoryRecords,
      nestedAnswerResponse,
      watchedAnswers,
    });
  }, [
    applicationId,
    questionnaire,
    MyGivenAnswareQuestionnaire,
    familyHistoryRecords,
    nestedAnswerResponse,
    watchedAnswers,
  ]);

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

  const saveCancerFamilyHistory = async (
    questionId: string,
    answer: QuestionAnswer,
  ) => {
    const onsetVal = answer.cancerAgeOnset;
    const deathVal = answer.cancerAgeAtDeath;

    if (onsetVal && !/^\d+$/.test(String(onsetVal))) {
      toast.error("Approximate age of onset must be a number");
      return false;
    }

    if (deathVal && !/^\d+$/.test(String(deathVal))) {
      toast.error("Age at death must be a number");
      return false;
    }

    try {
      console.log("[StepHealthDetails] saving family history answer", {
        applicationId,
        questionId,
        payload: {
          relation: answer.cancerRelation?.trim() || "",
          diagnosis: answer.cancerDiagnosis?.trim() || undefined,
          approxAgeOfOnset: answer.cancerAgeOnset ? parseInt(String(answer.cancerAgeOnset), 10) : undefined,
          ageAtDeath: answer.cancerAgeAtDeath ? parseInt(String(answer.cancerAgeAtDeath), 10) : undefined,
        },
      });

      const res = await familyHealthHistory({
        applicationId: applicationId as string,
        questionId,
        relation: answer.cancerRelation?.trim() || "",
        diagnosis: answer.cancerDiagnosis?.trim() || undefined,
        approxAgeOfOnset: answer.cancerAgeOnset
          ? parseInt(String(answer.cancerAgeOnset), 10)
          : undefined,
        ageAtDeath: answer.cancerAgeAtDeath
          ? parseInt(String(answer.cancerAgeAtDeath), 10)
          : undefined,
      }).unwrap();

      // Ensure the form reflects the saved values returned from the server
      if (res) {
        console.log("[StepHealthDetails] family history answer saved", {
          applicationId,
          questionId,
          saved: res,
        });
        const savedData = res.data || res;
        form.setValue(`answers.${questionId}.cancerRelation`, savedData.relation ?? "");
        form.setValue(`answers.${questionId}.cancerDiagnosis`, savedData.diagnosis ?? "");
        form.setValue(`answers.${questionId}.cancerAgeOnset`, savedData.approxAgeOfOnset !== undefined && savedData.approxAgeOfOnset !== null ? String(savedData.approxAgeOfOnset) : "");
        form.setValue(`answers.${questionId}.cancerAgeAtDeath`, savedData.ageAtDeath !== undefined && savedData.ageAtDeath !== null ? String(savedData.ageAtDeath) : "");
        // Update autosave baseline so the saved values are considered the previous state
        try {
          const prevAnswers = previousAnswersRef.current ?? {};
          const prevQuestionAnswer = prevAnswers[questionId] ?? {};
          previousAnswersRef.current = {
            ...prevAnswers,
            [questionId]: {
              ...(prevQuestionAnswer || {}),
              cancerRelation: savedData.relation ?? "",
              cancerDiagnosis: savedData.diagnosis ?? "",
              cancerAgeOnset: savedData.approxAgeOfOnset !== undefined && savedData.approxAgeOfOnset !== null ? String(savedData.approxAgeOfOnset) : "",
              cancerAgeAtDeath: savedData.ageAtDeath !== undefined && savedData.ageAtDeath !== null ? String(savedData.ageAtDeath) : "",
            },
          };
        } catch (err) {
          // ignore
        }
      }

      return true;
    } catch (err) {
      console.error("familyHealthHistory error (save)", err);
      return false;
    }
  };

  const hasCancerDetails = (answer?: QuestionAnswer) => {
    if (!answer) return false;

    return Boolean(
      answer.cancerRelation?.trim() ||
      answer.cancerDiagnosis?.trim() ||
      answer.cancerAgeOnset?.trim() ||
      answer.cancerAgeAtDeath?.trim()
    );
  };

  const persistChangedAnswers = async (answers: Record<string, QuestionAnswer>) => {
    if (!applicationId || !questionnaire?.id) return true;

    const prevAnswers = previousAnswersRef.current ?? {};
    const changedQuestionIds: string[] = [];
    const changedNestedQuestionIds: { parentId: string; nestedId: string }[] = [];

    for (const [questionId, currentAnswer] of Object.entries(answers)) {
      const prevAnswer = prevAnswers[questionId];

      // 1. Check if the parent question or its specific fields changed
      let hasParentChanged = 
        prevAnswer?.answer !== currentAnswer?.answer ||
        prevAnswer?.nested?.explanation !== currentAnswer?.nested?.explanation ||
        prevAnswer?.cancerDiagnosis !== currentAnswer?.cancerDiagnosis ||
        prevAnswer?.cancerRelation !== currentAnswer?.cancerRelation ||
        prevAnswer?.cancerAgeOnset !== currentAnswer?.cancerAgeOnset ||
        prevAnswer?.cancerAgeAtDeath !== currentAnswer?.cancerAgeAtDeath ||
        prevAnswer?.tobaccoCurrentUser !== currentAnswer?.tobaccoCurrentUser ||
        prevAnswer?.tobaccoLastUsed !== currentAnswer?.tobaccoLastUsed;

      if (hasParentChanged) {
        changedQuestionIds.push(questionId);
      }

      // 2. Check if generic nested answers changed
      let hasGenericNestedChanged = false;
      if (currentAnswer?.nestedAnswers) {
        for (const [nestedId, currNested] of Object.entries(currentAnswer.nestedAnswers)) {
          const prevNested = prevAnswer?.nestedAnswers?.[nestedId];
          if (
            prevNested?.answer !== currNested?.answer ||
            prevNested?.value !== currNested?.value
          ) {
            changedNestedQuestionIds.push({ parentId: questionId, nestedId });
            hasGenericNestedChanged = true;
          }
        }
      }

      if (hasGenericNestedChanged && !changedQuestionIds.includes(questionId)) {
        changedQuestionIds.push(questionId);
      }
    }

    if (changedQuestionIds.length === 0 && changedNestedQuestionIds.length === 0) return true;

    setSaveStates((prev) => {
      const next = { ...prev };
      changedQuestionIds.forEach((id) => {
        next[id] = "saving";
      });
      return next;
    });

    const errors: string[] = [];

    for (const questionId of changedQuestionIds) {
      const answer = answers[questionId];
      const q = questionnaire.questions?.find((item) => item.id === questionId);
      if (!q) continue;

      if (answer?.answer !== undefined) {
        try {
          await giveAnswer({
            applicationId,
            questionnaireId: questionnaire.id,
            questionId,
            answerBoolean: answer.answer === "Yes",
            inputValue:
              q.category !== "CANCER"
                ? ((answer.nested?.explanation as string) || undefined)
                : undefined,
          }).unwrap();
        } catch (error) {
          console.error("giveAnswer error", error);
          errors.push(questionId);
        }
      }

      // Save tobacco nested if applicable
      const isTobaccoQuestion = (q.questionText.toLowerCase().includes("tobacco") || q.questionText.toLowerCase().includes("nicotine")) && (q.nestedQuestions?.length ?? 0) > 0;
      if (isTobaccoQuestion && q.nestedQuestions?.[0] && answer?.tobaccoCurrentUser !== undefined) {
        try {
          await giveAnswer({
            applicationId,
            questionnaireId: questionnaire.id,
            nestedQuestionId: q.nestedQuestions[0].id,
            answerBoolean: answer.tobaccoCurrentUser === "Yes",
            inputValue: answer.tobaccoLastUsed || undefined,
          }).unwrap();
        } catch (error) {
          console.error("giveAnswer nested error", error);
          errors.push(questionId);
        }
      }

      if (
        q.category === "CANCER" &&
        answer?.answer === "Yes" &&
        hasCancerDetails(answer)
      ) {
        try {
          const savedCancerHistory = await saveCancerFamilyHistory(questionId, answer);
          if (!savedCancerHistory) {
            errors.push(questionId);
          }
        } catch (error) {
          console.error("familyHealthHistory error", error);
          errors.push(questionId);
        }
      }
    }

    // Save generic nested questions
    for (const { parentId, nestedId } of changedNestedQuestionIds) {
      const parentAnswer = answers[parentId];
      const nestedQAnswer = parentAnswer?.nestedAnswers?.[nestedId];
      if (nestedQAnswer) {
        try {
          await giveAnswer({
            applicationId,
            questionnaireId: questionnaire.id,
            nestedQuestionId: nestedId,
            answerBoolean: nestedQAnswer.answer === "Yes",
            inputValue: nestedQAnswer.value || undefined,
          }).unwrap();
        } catch (error) {
          console.error("giveAnswer generic nested error", error);
          if (!errors.includes(parentId)) {
            errors.push(parentId);
          }
        }
      }
    }

    setSaveStates((prev) => {
      const next = { ...prev };
      changedQuestionIds.forEach((id) => {
        next[id] = errors.includes(id) ? "error" : "saved";
      });
      return next;
    });

    setTimeout(() => {
      setSaveStates((prev) => {
        const next = { ...prev };
        changedQuestionIds.forEach((id) => {
          if (next[id] === "saved") delete next[id];
        });
        return next;
      });
    }, 2500);

    previousAnswersRef.current = JSON.parse(JSON.stringify(answers));
    return errors.length === 0;
  };

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
      await persistChangedAnswers(watchedAnswers);
    }, 900);

    return () => clearTimeout(timer);
  }, [
    watchedAnswers,
    applicationId,
    questionnaire,
    giveAnswer,
    familyHealthHistory,
  ]);

  if (isLoading || isLoadingNestedAnswer || isLoadingFamilyHistory) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loading />
      </div>
    );
  }

  const onSubmit = async (values: HealthStepFormValues) => {
    if (values.hipaaAcknowledged !== true) {
      toast.error("Please acknowledge the HIPAA disclaimer before continuing.");
      return;
    }
    const saved = await persistChangedAnswers(values.answers);
    if (!saved) {
      toast.error("Some answers could not be saved. Please try again.");
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

  const handleSaveExit = async () => {
    const values = form.getValues();
    const saved = await persistChangedAnswers(values.answers);
    if (!saved) {
      toast.error("Some answers could not be saved. Please try again.");
      return;
    }

    const mapped = mapToHealthDetails(
      questionnaire,
      values.answers,
      values.hipaaAcknowledged,
    );
    saveHealthDetails(mapped);
    router.push("/dashboard"); // Redirect to dashboard/home
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
          backLabel="← Back to Representative"
          onSaveExit={handleSaveExit}
          onNext={nextStep}
          nextLabel="See Review →"
          isSubmitting={form.formState.isSubmitting}
        />
      </form>
    </Form>
  );
}
