import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface AuthButtonProps {
  children: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  type?: "submit" | "button" | "reset";
  onClick?: () => void;
}

export function AuthButton({
  children,
  isLoading,
  disabled,
  type = "submit",
  onClick,
}: AuthButtonProps) {
  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={isLoading || disabled}
      className="w-full h-11 bg-[#5C7FC4] hover:bg-[#4A6BAF] active:bg-[#3D5A9C] text-white font-semibold text-sm rounded-lg transition-all duration-200 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
      ) : null}
      {children}
    </Button>
  );
}