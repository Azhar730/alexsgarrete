import Image from "next/image";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PetHeaderCardProps {
  name: string;
  status?: "Active" | "Inactive";
  breed: string;
  age: string;
  gender: string;
  imageUrl?: string;
  onEditClick: () => void;
}

export function PetHeaderCard({
  name,
  status = "Active",
  breed,
  age,
  gender,
  imageUrl,
  onEditClick,
}: PetHeaderCardProps) {
  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200/80 shadow-sm px-5 py-5 sm:px-7 sm:py-6 flex items-center justify-between gap-4">
      {/* Left: avatar + info */}
      <div className="flex items-center gap-4 sm:gap-5 min-w-0">
        {/* Avatar */}
        <div className="relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm bg-gray-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={`${name} photo`}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl text-gray-400 select-none">
              🐾
            </div>
          )}
        </div>

        {/* Name + badge + meta */}
        <div className="min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight leading-none">
              {name}
            </h1>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold leading-none
                ${
                  status === "Active"
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-200/60"
                    : "bg-gray-100 text-gray-500 border border-gray-200"
                }`}
            >
              {status}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1.5 leading-snug">
            {breed} &bull; {age} &bull; {gender}
          </p>
        </div>
      </div>

      {/* Right: Edit button */}
      <Button
        variant="outline"
        size="sm"
        onClick={onEditClick}
        className="shrink-0 rounded-xl border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300 gap-1.5 text-sm font-medium transition-all"
      >
        <Pencil className="w-3.5 h-3.5" />
        <span className="hidden xs:inline">Edit Profile</span>
        <span className="xs:hidden">Edit</span>
      </Button>
    </div>
  );
}
