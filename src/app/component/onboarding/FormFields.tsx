import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { Control, FieldValues, Path } from "react-hook-form";
import { cn } from "@/lib/utils";

// ─── Shared input field ────────────────────────────────────────────────────────
interface FormInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  className?: string;
  autoComplete?: string;
  min?: string;
  max?: string;
}

export function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
  disabled,
  className,
  autoComplete,
  min,
  max,
}: FormInputProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("space-y-1", className)}>
          {label && (
            <FormLabel className="text-sm font-medium text-gray-700">
              {label}
            </FormLabel>
          )}
          <FormControl>
            <Input
              {...field}
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              autoComplete={autoComplete}
              min={min}
              max={max}
              className="h-10 rounded-md border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-[#5C7FC4]/30 focus-visible:border-[#5C7FC4] transition-all"
            />
          </FormControl>
          <FormMessage className="text-xs text-red-500" />
        </FormItem>
      )}
    />
  );
}

// ─── Textarea field ────────────────────────────────────────────────────────────
interface FormTextareaProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  className?: string;
}

export function FormTextarea<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  rows = 3,
  disabled,
  className,
}: FormTextareaProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("space-y-1", className)}>
          {label && (
            <FormLabel className="text-sm font-medium text-gray-700">
              {label}
            </FormLabel>
          )}
          <FormControl>
            <Textarea
              {...field}
              rows={rows}
              placeholder={placeholder}
              disabled={disabled}
              className="rounded-md border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-[#5C7FC4]/30 focus-visible:border-[#5C7FC4] transition-all resize-none"
            />
          </FormControl>
          <FormMessage className="text-xs text-red-500" />
        </FormItem>
      )}
    />
  );
}

// ─── Select field ──────────────────────────────────────────────────────────────
interface FormSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  options: { value: string; label: string }[];
  disabled?: boolean;
  className?: string;
}

export function FormSelect<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  options,
  disabled,
  className,
}: FormSelectProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("space-y-1", className)}>
          {label && (
            <FormLabel className="text-sm font-medium text-gray-700">
              {label}
            </FormLabel>
          )}
          <Select
            onValueChange={field.onChange}
            value={field.value}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger className="h-10 rounded-md border-gray-200 bg-white text-sm text-gray-900 focus:ring-2 focus:ring-[#5C7FC4]/30 focus:border-[#5C7FC4]">
                <SelectValue
                  placeholder={
                    placeholder && (
                      <span className="text-gray-400">{placeholder}</span>
                    )
                  }
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage className="text-xs text-red-500" />
        </FormItem>
      )}
    />
  );
}

// ─── Yes/No Radio group ────────────────────────────────────────────────────────
interface YesNoRadioProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  className?: string;
}

export function YesNoRadio<T extends FieldValues>({
  control,
  name,
  label,
  className,
}: YesNoRadioProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("space-y-2", className)}>
          {label && (
            <FormLabel className="text-sm font-medium text-gray-700 leading-snug">
              {label}
            </FormLabel>
          )}
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value}
              className="flex items-center gap-6"
            >
              {["Yes", "No"].map((opt) => (
                <div key={opt} className="flex items-center gap-2">
                  <RadioGroupItem
                    value={opt}
                    id={`${String(name)}-${opt}`}
                    className="border-gray-300 text-[#5C7FC4] w-4 h-4"
                  />
                  <Label
                    htmlFor={`${String(name)}-${opt}`}
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    {opt}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage className="text-xs text-red-500" />
        </FormItem>
      )}
    />
  );
}

// ─── Section divider ──────────────────────────────────────────────────────────
export function SectionDivider() {
  return <div className="border-t border-gray-100 my-1" />;
}

// ─── Step header ──────────────────────────────────────────────────────────────
interface StepHeaderProps {
  step: number;
  title: string;
  description: string;
}

export function StepHeader({ step, title, description }: StepHeaderProps) {
  return (
    <div className="mb-5">
      <h1 className="text-xl font-bold text-gray-900 tracking-tight">
        Step {step}: {title}
      </h1>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      <div className="mt-4 border-t border-gray-100" />
    </div>
  );
}

// ─── Bottom navigation bar ────────────────────────────────────────────────────
interface StepNavProps {
  onBack?: () => void;
  onSaveExit?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  backLabel?: string;
  isSubmitting?: boolean;
  nextDisabled?: boolean;
}

export function StepNav({
  onBack,
  onSaveExit,
  onNext,
  nextLabel = "Next →",
  backLabel = "← Back",
  isSubmitting,
  nextDisabled,
}: StepNavProps) {
  return (
    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
      <div>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
          >
            {backLabel}
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        {onSaveExit && (
          <button
            type="button"
            onClick={onSaveExit}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
          >
            Save and Exit
          </button>
        )}
        {onNext && (
          <button
            type="submit"
            disabled={isSubmitting || nextDisabled}
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-[#5C7FC4] rounded-md hover:bg-[#4A6BAF] transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : null}
            {nextLabel}
          </button>
        )}
      </div>
    </div>
  );
}
