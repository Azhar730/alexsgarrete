import Image from "next/image";
import Link from "next/link";

interface PlanReadyCardProps {
  petName: string;
  breed: string;
}

export default function PlanReadyCard({ petName, breed }: PlanReadyCardProps) {
  return (
    <div className="mb-8 relative container mx-auto">
      {/* Background image — hidden on mobile, shown md+ */}
      <div className="hidden md:block">
        <Image
          src="/bg-plan-ready.png"
          alt="Plan Ready"
          width={1550}
          height={120}
          className="w-full h-auto rounded-2xl"
        />
      </div>

      {/* Mobile: plain styled card (no bg image) */}
      <div className="md:hidden bg-white border border-gray-200 rounded-2xl shadow-sm px-4 py-4 flex flex-col gap-3">
        {/* Top row: title + badge */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-secondary font-bold text-3xl md:text-4xl">
            Your Plan is Ready
          </span>
          <span className="flex items-center gap-1 text-xs text-blue-600 border border-blue-200 bg-blue-50 rounded-full px-2 py-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
            Quote Ready
          </span>
        </div>

        {/* Subtitle */}
        <p className="text-muted-foreground text-base leading-snug">
          We&apos;ve prepared your plan based on your information. Please review
          and accept to continue.
        </p>

        {/* Pet name + CTA */}
        <div className="flex items-center justify-between gap-3 mt-1">
          <span className="text-primary text-base font-medium truncate">
            {petName} ({breed})
          </span>
          <Link href="/dashboard/quote" className="shrink-0">
            <button className="shrink-0 bg-slate-700 hover:bg-slate-800 active:bg-slate-900 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
              Check Quote
            </button>
          </Link>
        </div>
      </div>

      {/* md+: overlay on top of bg image */}
      <div className="hidden md:flex absolute inset-0 items-center justify-between px-6 lg:px-8">
        {/* Left */}
        <div className="flex flex-col gap-1 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="text-secondary font-bold text-3xl">
              Your Plan is Ready
            </span>
            <span className="flex items-center gap-1 text-xs text-primary border border-blue-200 bg-blue-50 rounded-full px-2 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
              Quote Ready
            </span>
          </div>
          <p className="text-muted-foreground text-base">
            We&apos;ve prepared your plan based on your information. Please
            review and accept to continue.
          </p>
        </div>

        {/* Right */}
        <div className="flex flex-col items-center gap-3 shrink-0">
          <span className="text-primary text-base font-medium">
            {petName} ({breed})
          </span>
          <Link href="/dashboard/quote/review" className="shrink-0">
            <button className="bg-primary cursor-pointer hover:bg-primary-hover active:bg-primary-active text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
              Check Quote
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
