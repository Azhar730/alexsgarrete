/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useEffect, useRef } from "react";
import { useForm, useWatch, Controller } from "react-hook-form";
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
import {
  useGetActiveQuestionnaireQuery,
  useGiveAnswerMutation,
  useFamilyHealthHistoryMutation,
} from "@/redux/api/onboardingApi";
import type { HealthDetailsValues } from "./application";
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

type HealthStepFormValues = {
  hipaaAcknowledged?: true;
  answers: Record<string, QuestionAnswer>;
};

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

        acc[q.id] = {
          answer: existing?.answer ?? toYesNo(topLevelAnswer?.answerBoolean),
          nested: existing?.nested ?? {},
          nestedAnswer:
            existing?.nestedAnswer ?? toYesNo(nestedAnswer?.answerBoolean),
          nestedInputValue:
            existing?.nestedInputValue ?? nestedAnswer?.inputValue ?? "",
          nestedDocumentUrl:
            existing?.nestedDocumentUrl ?? nestedAnswer?.documentUrl ?? "",
          cancerRelation:
            existing?.cancerRelation ?? familyHistory?.relation ?? "",
          cancerDiagnosis:
            existing?.cancerDiagnosis ?? familyHistory?.diagnosis ?? "",
          cancerAgeOnset:
            existing?.cancerAgeOnset ??
            (familyHistory?.approxAgeOfOnset !== undefined &&
            familyHistory?.approxAgeOfOnset !== null
              ? String(familyHistory.approxAgeOfOnset)
              : ""),
          cancerAgeAtDeath:
            existing?.cancerAgeAtDeath ??
            (familyHistory?.ageAtDeath !== undefined &&
            familyHistory?.ageAtDeath !== null
              ? String(familyHistory.ageAtDeath)
              : ""),
          tobaccoCurrentUser:
            existing?.tobaccoCurrentUser ?? toYesNo(nestedAnswer?.answerBoolean),
          tobaccoLastUsed:
            existing?.tobaccoLastUsed ?? nestedAnswer?.inputValue ?? "",
        };
        return acc;
      },
      {},
    ) ?? {};

  return { hipaaAcknowledged: saved?.hipaaAcknowledged, answers };
}

function mapToHealthDetails(
  questionnaire: Questionnaire | undefined,
  answers: Record<string, QuestionAnswer>,
  hipaaAcknowledged: true,
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
}: {
  value?: "Yes" | "No";
  onChange: (v: "Yes" | "No") => void;
  name: string;
}) {
  return (
    <RadioGroup
      value={value ?? ""}
      onValueChange={(v) => onChange(v as "Yes" | "No")}
      className="flex items-center gap-6"
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
            className="text-sm text-gray-700 cursor-pointer font-normal select-none"
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
}

function QuestionBlock({ question, form, watchedAnswers }: QuestionBlockProps) {
  const isCANCER = question.category === "CANCER";
  const isHEALTH = question.category === "HEALTH";
  // Tobacco = has nested questions but NOT CANCER
  const isTOBACCO = (question.nestedQuestions?.length ?? 0) > 0 && !isCANCER;

  const answerVal = watchedAnswers?.[question.id]?.answer;

  console.log("Rendering QuestionBlock", question.id, "answer:", answerVal);
  
  const tobaccoCurrentUser = watchedAnswers?.[question.id]?.tobaccoCurrentUser;

  // The one nested question from API for tobacco: "If yes, are you a current user?"
  const tobaccoNestedQ = question.nestedQuestions?.[0];

  return (
    <div>
      {/* ── Divider ─────────────────────────────────────────────────── */}
      <div className="border-t border-gray-100 my-5" />

      {/* ── Question text ───────────────────────────────────────────── */}
      <p className="text-sm text-gray-700 leading-snug mb-2.5">
        {question.questionText}
      </p>

      {/* ── Top-level Yes / No ──────────────────────────────────────── */}
      <Controller
        control={form.control}
        name={`answers.${question.id}.answer`}
        render={({ field }) => (
          <YesNoInline
            name={`q-${question.id}`}
            value={field.value}
            onChange={field.onChange}
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
                placeholder="Diagnosed with early-stage condition in Jan 2022. Currently undergoing routine monitoring."
                className="w-full border border-gray-200 rounded-lg text-sm text-gray-700
                           placeholder:text-gray-400 resize-none
                           focus-visible:ring-1 focus-visible:ring-[#5C7FC4]
                           focus-visible:border-[#5C7FC4]"
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
                  <Input {...field} className={inputCls} />
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
                  <Input {...field} className={inputCls} />
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
                  <Input {...field} className={inputCls} />
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
                  <Input {...field} className={inputCls} />
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
                    placeholder="August 2019"
                    className={inputCls}
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
}: {
  MyGivenAnswareQuestionnaire?: any;
  applicationId?: string;
}) {
  const { data, saveHealthDetails, nextStep, prevStep } = useApplication();
  const { data: questionnaireResponse } =
    useGetActiveQuestionnaireQuery(undefined);
  const questionnaire = normalizeQuestionnaire(questionnaireResponse);

  const defaultValues = useMemo(
    () =>
      buildDefaultAnswers(
        questionnaire,
        data.healthDetails,
        normalizeQuestionnaire(MyGivenAnswareQuestionnaire),
      ),
    [MyGivenAnswareQuestionnaire, data.healthDetails, questionnaire],
  );

  const form = useForm<HealthStepFormValues>({
    defaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [form, defaultValues]);

  const watchedAnswers = useWatch({ control: form.control, name: "answers" });

  const [giveAnswer] = useGiveAnswerMutation();
  const [familyHealthHistory] = useFamilyHealthHistoryMutation();
  const submittedQuestions = useRef<Set<string>>(new Set());
  const previousAnswersRef = useRef<Record<string, QuestionAnswer> | undefined>(
    undefined,
  );
  console.log("MyGivenAnswareQuestionnaire", MyGivenAnswareQuestionnaire);

  // Effect to submit only CHANGED answers (not all answers at once)
  useEffect(() => {
    if (!applicationId || !questionnaire?.id || !watchedAnswers) return;

    const timer = setTimeout(async () => {
      // Find which question actually changed
      const prevAnswers = previousAnswersRef.current ?? {};
      const changedQuestionIds: string[] = [];

      for (const [questionId, currentAnswer] of Object.entries(watchedAnswers)) {
        const prevAnswer = prevAnswers[questionId];

        // Check if answer changed
        if (
          prevAnswer?.answer !== currentAnswer?.answer ||
          prevAnswer?.nested?.explanation !==
            currentAnswer?.nested?.explanation ||
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

      // Submit only changed answers
      for (const questionId of changedQuestionIds) {
        const answer = watchedAnswers[questionId];
        const q = questionnaire.questions?.find((x) => x.id === questionId);
        if (!q) continue;

        // Send main answer
        if (answer?.answer !== undefined) {
          try {
            await giveAnswer({
              applicationId,
              questionnaireId: questionnaire.id,
              questionId,
              answerBoolean: answer.answer === "Yes",
              inputValue:
                // Prefer only main-question detail fields here.
                (answer.nested?.explanation as string) ||
                answer.cancerDiagnosis ||
                undefined,
            }).unwrap();
            submittedQuestions.current.add(questionId);
          } catch (e) {
            console.error("giveAnswer error", e);
          }
        }

        // Send nested tobacco answer as a separate payload with nestedQuestionId only.
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

        // If cancer answer with details, save family health history
        if (
          q.category === "CANCER" &&
          answer?.answer === "Yes" &&
          answer.cancerDiagnosis
        ) {
          try {
            await familyHealthHistory({
              questionId,
              relation: answer.cancerRelation || "",
              diagnosis: answer.cancerDiagnosis || "",
              approxAgeOfOnset: answer.cancerAgeOnset
                ? parseInt(String(answer.cancerAgeOnset))
                : undefined,
              ageAtDeath: answer.cancerAgeAtDeath
                ? parseInt(String(answer.cancerAgeAtDeath))
                : undefined,
            }).unwrap();
          } catch (e) {
            console.error("familyHealthHistory error", e);
          }
        }
      }

      // Update reference for next comparison
      previousAnswersRef.current = JSON.parse(JSON.stringify(watchedAnswers));
    }, 1000); // Increased debounce from 500ms to 1000ms

    return () => clearTimeout(timer);
  }, [
    watchedAnswers,
    applicationId,
    questionnaire,
    giveAnswer,
    familyHealthHistory,
  ]);

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* ── HIPAA ──────────────────────────────────────────────────── */}
        <div className="mb-6">
          <div className="text-xs text-gray-600 leading-relaxed whitespace-pre-line mb-4">
            {HIPAA_TEXT}
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
                      onCheckedChange={(checked) =>
                        field.onChange(checked === true ? true : undefined)
                      }
                      className="mt-0.5 border-gray-400
                                 data-[state=checked]:bg-[#5C7FC4]
                                 data-[state=checked]:border-[#5C7FC4]"
                    />
                  </FormControl>
                  <Label className="text-sm text-gray-700 font-medium cursor-pointer leading-snug">
                    I acknowledge that I have read, understood, and agree to the
                    Encore LLC HIPAA disclaimer
                  </Label>
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
          onSaveExit={() => {}}
          onNext={nextStep}
          nextLabel="Dog Information →"
          isSubmitting={form.formState.isSubmitting}
        />
      </form>
    </Form>
  );
}
