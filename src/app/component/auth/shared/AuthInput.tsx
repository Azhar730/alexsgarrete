import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Control, FieldValues, Path } from "react-hook-form";
import type { InputHTMLAttributes } from "react";

interface AuthInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
  rightElement?: React.ReactNode;
  disabled?: boolean;
  autoComplete?: string;
}

/**
 * Generic labeled input field for auth forms.
 * Wraps react-hook-form's <FormField> + shadcn <Input>.
 */
export function AuthInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
  rightElement,
  disabled,
  autoComplete,
}: AuthInputProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-1.5">
          <FormLabel className="text-sm font-medium text-gray-700">
            {label}
          </FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                {...field}
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                autoComplete={autoComplete}
                className="h-11 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-[#5C7FC4]/40 focus-visible:border-[#5C7FC4] transition-all pr-10"
              />
              {rightElement && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {rightElement}
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage className="text-xs text-red-500" />
        </FormItem>
      )}
    />
  );
}