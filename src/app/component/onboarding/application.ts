import { z } from "zod";

// ─── Step schemas ─────────────────────────────────────────────────────────────

export const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleInitial: z.string().max(1, "Only one character allowed").optional(),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  ssnLast4: z
    .string()
    .length(4, "Must be exactly 4 digits")
    .regex(/^\d{4}$/, "Digits only"),
  streetAddress: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z
    .string()
    .regex(/^\d{5}(-\d{4})?$/, "Enter a valid ZIP code"),
  cellPhone: z.string().min(10, "Enter a valid phone number"),
  homePhone: z.string().optional(),
  workPhone: z.string().optional(),
});

export const dogSchema = z.object({
  photoUrl: z.string().optional(),
  name: z.string().min(1, "Dog name is required"),
  gender: z.enum(["Male", "Female"]),
  spayedNeutered: z.enum(["Yes", "No"]),
  birthday: z.string().min(1, "Birthday is required"),
  primaryBreed: z.string().min(1, "Primary breed is required"),
  additionalBreeds: z.string().optional(),
  colorCoatDescription: z.string().min(1, "Color/coat description is required"),
  microchipped: z.enum(["Yes", "No"]),
  microchipNumber: z.string().optional(),
  microchipId: z.string().optional(),
});

export const dogsStepSchema = z.object({
  dogs: z.array(dogSchema).min(1, "Add at least one dog"),
});

export const representativeSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  relationship: z.string().min(1, "Relationship is required"),
  phoneNumber: z.string().min(10, "Enter a valid phone number"),
  email: z.string().email("Enter a valid email"),
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
  cancerAgeOnset: z.string().optional(),
  cancerAgeAtDeath: z.string().optional(),
  familyHeartDisease: z.enum(["Yes", "No"]),
  familyDiabetes: z.enum(["Yes", "No"]),
  tobaccoUse: z.enum(["Yes", "No"]),
  tobaccoCurrentUser: z.enum(["Yes", "No"]).optional(),
  tobaccoLastUsed: z.string().optional(),
});

// ─── Combined form data ───────────────────────────────────────────────────────

export type PersonalInfoValues = z.infer<typeof personalInfoSchema>;
export type DogValues = z.infer<typeof dogSchema>;
export type DogsStepValues = z.infer<typeof dogsStepSchema>;
export type RepresentativeValues = z.infer<typeof representativeSchema>;
export type HealthDetailsValues = z.infer<typeof healthDetailsSchema>;

export interface ApplicationData {
  personalInfo?: PersonalInfoValues;
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
