interface DetailRowProps {
  label: string;
  value: string;
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-gray-400 font-medium tracking-wide uppercase leading-none">
        {label}
      </p>
      <p
        className={`text-sm font-semibold leading-snug ${
          value === "N/A" ? "text-gray-400 font-normal italic" : "text-gray-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

interface PetDetailsCardProps {
  name: string;
  gender: string;
  spayedNeutered: string;
  birthday: string;
  primaryBreed: string;
  additionalBreed?: string;
  colorCoat: string;
  microchipped: string;
  microchipNumber?: string;
  microchipId?: string;
}

export function PetDetailsCard({
  name,
  gender,
  spayedNeutered,
  birthday,
  primaryBreed,
  additionalBreed,
  colorCoat,
  microchipped,
  microchipNumber,
  microchipId,
}: PetDetailsCardProps) {
  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200/80 shadow-sm px-5 py-6 sm:px-7 sm:py-7">
      <h2 className="text-base font-bold text-gray-900 mb-6">Pet Details</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
        <DetailRow label="Name of Dog" value={name} />
        <DetailRow label="Gender" value={gender} />
        <DetailRow label="Spayed / Neutered" value={spayedNeutered} />
        <DetailRow label="Birthday / Age of Pet" value={birthday} />
        <DetailRow label="Primary Breed" value={primaryBreed} />
        <DetailRow
          label="Additional Breed(s)"
          value={additionalBreed || "N/A"}
        />
        <DetailRow
          label="Color(s) & Coat description"
          value={colorCoat}
        />
        <DetailRow label="Microchipped" value={microchipped} />
        {microchipped.toLowerCase() === "yes" && (
          <>
            <DetailRow
              label="Microchip number"
              value={microchipNumber || "—"}
            />
            <DetailRow
              label="Microchip ID"
              value={microchipId || "—"}
            />
          </>
        )}
      </div>
    </div>
  );
}
