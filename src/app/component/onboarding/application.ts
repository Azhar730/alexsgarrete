import { z } from "zod";

// ─── Step schemas ─────────────────────────────────────────────────────────────

export const personalInfoSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  middleInitial: z.string().trim().max(1, "Only one character allowed").optional(),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.string().trim().email("Enter a valid email"),
  ssnLast4: z
    .string()
    .trim()
    .length(4, "Must be exactly 4 digits")
    .regex(/^\d{4}$/, "Digits only"),
  streetAddress: z.string().trim().min(1, "Street address is required"),
  city: z.string().trim().min(1, "City is required"),
  state: z.string().trim().min(2, "State is required"),
  zipCode: z
    .string()
    .trim()
    .regex(/^\d{5}(-\d{4})?$/, "Enter a valid ZIP code"),
  cellPhone: z.string().trim().min(10, "Enter a valid phone number"),
  homePhone: z.string().trim().optional(),
  workPhone: z.string().trim().optional(),
  birthday: z
    .string()
    .trim()
    .min(1, "Birthday is required")
    .refine((value) => !Number.isNaN(Date.parse(value)), "Select a valid date")
    .refine((value) => new Date(value) <= new Date(), "Birthday cannot be in the future"),
});

export const dogSchema = z.object({
  id: z.string().optional(),
  photoUrl: z.string().optional(),
  name: z.string().trim().min(1, "Dog name is required"),
  gender: z.enum(["Male", "Female"]),
  spayedNeutered: z.enum(["Yes", "No"]),
  birthday: z
    .string()
    .trim()
    .min(1, "Birthday is required")
    .refine((value) => !Number.isNaN(Date.parse(value)), "Select a valid date")
    .refine((value) => new Date(value) <= new Date(), "Birthday cannot be in the future"),
  primaryBreed: z.string().trim().min(1, "Primary breed is required"),
  additionalBreeds: z.string().trim().optional(),
  colorCoatDescription: z.string().trim().min(1, "Color/coat description is required"),
  weight: z.string().trim().optional(),
  microchipped: z.enum(["Yes", "No"]),
  microchipNumber: z.string().trim().optional(),
  microchipId: z.string().trim().optional(),
});

export const dogsStepSchema = z.object({
  dogs: z.array(dogSchema).min(1, "Add at least one dog"),
});

export const representativeSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleInitial: z.string().trim().max(1, "Only one character allowed").optional(),
  lastName: z.string().min(1, "Last name is required"),
  relationship: z.string().min(1, "Relationship is required"),
  phoneNumber: z.string().optional(),
  email: z.string().email("Enter a valid email"),
  streetAddress: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, "Enter a valid ZIP code"),
  cellPhone: z.string().min(10, "Enter a valid phone number"),
  homePhone: z.string().optional(),
  workPhone: z.string().optional(),
});

export const healthDetailsSchema = z.object({
  hipaaAcknowledged: z.literal(true, {
    message: "You must acknowledge the HIPAA disclaimer",
  }),
  chronicConditions: z.enum(["Yes", "No"]),
  terminalConditions: z.enum(["Yes", "No"]),
  terminalExplanation: z.string().optional(),
  familyCancer: z.enum(["Yes", "No"]),
  cancerRelation: z.string().optional(),
  cancerDiagnosis: z.string().optional(),
  cancerAgeOnset: z.string().optional().refine((v) => v === undefined || v === "" || /^\d+$/.test(v), {
    message: "Enter a valid age (digits only)",
  }),
  cancerAgeAtDeath: z.string().optional().refine((v) => v === undefined || v === "" || /^\d+$/.test(v), {
    message: "Enter a valid age (digits only)",
  }),
  familyHeartDisease: z.enum(["Yes", "No"]),
  familyDiabetes: z.enum(["Yes", "No"]),
  tobaccoUse: z.enum(["Yes", "No"]),
  tobaccoCurrentUser: z.enum(["Yes", "No"]).optional(),
  tobaccoLastUsed: z.string().optional(),
});

// ─── Combined form data ───────────────────────────────────────────────────────

export type PersonalInfoValues = z.infer<typeof personalInfoSchema>;

export type DogValues = z.infer<typeof dogSchema> & {
  id?: string;
};
export type DogsStepValues = {
  dogs: DogValues[];
};
export type RepresentativeValues = z.infer<typeof representativeSchema>;
export interface HealthDetailsValues {
  hipaaAcknowledged?: boolean;
  chronicConditions?: "Yes" | "No";
  terminalConditions?: "Yes" | "No";
  terminalExplanation?: string;
  familyCancer?: "Yes" | "No";
  cancerRelation?: string;
  cancerDiagnosis?: string;
  cancerAgeOnset?: string;
  cancerAgeAtDeath?: string;
  familyHeartDisease?: "Yes" | "No";
  familyDiabetes?: "Yes" | "No";
  tobaccoUse?: "Yes" | "No";
  tobaccoCurrentUser?: "Yes" | "No";
  tobaccoLastUsed?: string;
  [key: string]: unknown;
}

export interface ApplicationData {
  personalInfo?: Partial<PersonalInfoValues>;
  dogs?: DogValues[];
  representative?: RepresentativeValues;
  healthDetails?: HealthDetailsValues;
}

// ─── Step config ──────────────────────────────────────────────────────────────

export const STEPS = [
  { id: 1, title: "Personal Info", subtitle: "Client details" },
  { id: 2, title: "Dog Information", subtitle: "Pet information" },
  { id: 3, title: "Representative", subtitle: "Emergency contact" },
  { id: 4, title: "Health Details", subtitle: "Medical history" },
  { id: 5, title: "Review", subtitle: "Submit application" },
] as const;

export type StepId = (typeof STEPS)[number]["id"];
