"use client";

import { useRef, KeyboardEvent, ClipboardEvent, ChangeEvent } from "react";
import { cn } from "@/lib/utils";

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
  hasError?: boolean;
}

/**
 * 6-box OTP input.
 * - Auto-focuses next box on type
 * - Backspace goes to previous box
 * - Paste fills all boxes
 */
export function OTPInput({
  value,
  onChange,
  length = 6,
  disabled,
  hasError,
}: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.split("").concat(Array(length).fill("")).slice(0, length);

  const focusNext = (index: number) => {
    if (index < length - 1) inputRefs.current[index + 1]?.focus();
  };

  const focusPrev = (index: number) => {
    if (index > 0) inputRefs.current[index - 1]?.focus();
  };

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const char = e.target.value.replace(/\D/g, "").slice(-1); // digits only
    const newDigits = [...digits];
    newDigits[index] = char;
    onChange(newDigits.join(""));
    if (char) focusNext(index);
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        const newDigits = [...digits];
        newDigits[index] = "";
        onChange(newDigits.join(""));
      } else {
        focusPrev(index);
      }
    }
    if (e.key === "ArrowLeft") focusPrev(index);
    if (e.key === "ArrowRight") focusNext(index);
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    onChange(text.padEnd(length, "").slice(0, length));
    // focus last filled or end
    const lastIdx = Math.min(text.length, length - 1);
    inputRefs.current[lastIdx]?.focus();
  };

  return (
    <div className="flex items-center gap-2 justify-center">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          className={cn(
            "w-11 h-12 text-center text-lg font-semibold text-gray-900 rounded-lg border bg-white outline-none transition-all duration-150",
            "focus:border-[#5C7FC4] focus:ring-2 focus:ring-[#5C7FC4]/30",
            hasError
              ? "border-red-400 bg-red-50"
              : digit
              ? "border-gray-400 bg-white"
              : "border-gray-200",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        />
      ))}
    </div>
  );
}