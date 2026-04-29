import Image from "next/image";

interface PlanReadyCardProps {
  petName: string;
  breed: string;
}

export default function PlanReadyCard({ petName, breed }: PlanReadyCardProps) {
  return (
    <div className="container mx-auto mb-8 relative">
      <Image
        src="/bg-plan-ready.png"
        alt="Plan Ready"
        width={1550}
        height={120}
        className="w-full h-auto"
      />

      {/* Overlay content */}
      <div className="absolute inset-0 flex items-center justify-between px-6">
        {/* Left side */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-gray-900 font-bold text-lg">Your Plan is Ready</span>
            <span className="flex items-center gap-1 text-xs text-blue-600 border border-blue-200 bg-blue-50 rounded-full px-2 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block"></span>
              Quote Ready
            </span>
          </div>
          <p className="text-gray-500 text-sm">
            We&apos;ve prepared your plan based on your information. Please review and accept to continue.
          </p>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-blue-600 text-sm font-medium">
            {petName} ({breed})
          </span>
          <button className="bg-slate-700 hover:bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            Check Quote
          </button>
        </div>
      </div>
    </div>
  );
}