import { AuthSlide } from "@/app/data/authConfig";
import Image from "next/image";

interface AuthShellProps {
  slide: AuthSlide;
  children: React.ReactNode;
}

/**
 * Two-column auth layout:
 * Left  → rounded image card with logo + quote overlay
 * Right → white form panel
 */
export function AuthShell({ slide, children }: AuthShellProps) {
  return (
    // Full-screen gray background
    <div className="min-h-screen w-full bg-[#E8E8E8] flex items-center justify-center p-4 sm:p-6">
      {/* Card container */}
      <div className="w-full max-w-[740px] bg-white rounded-[20px] shadow-[0_4px_40px_rgba(0,0,0,0.10)] overflow-hidden flex flex-col md:flex-row min-h-[480px]">

        {/* ── Left: Image panel ──────────────────────────────────────── */}
        <div className="relative w-full md:w-[340px] md:min-w-[340px] min-h-[220px] md:min-h-0 shrink-0 rounded-[16px] overflow-hidden m-3 md:m-3">

          {/* Background image */}
          <Image
            src={slide.image}
            alt={slide.alt}
            fill
            className="object-cover object-center"
            priority
            sizes="(max-width: 768px) 100vw, 340px"
          />

          {/* Dark gradient overlay at bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          {/* Logo badge */}
          <div className="absolute top-4 left-4 z-10">
            <Image
              src="/encore.png"
              alt="Encore logo"
              width={100}
              height={32}
            />
          </div>

          {/* Quote text */}
          <div className="absolute bottom-5 left-4 right-4 z-10">
            <p className="text-white font-bold text-xl leading-snug whitespace-pre-line drop-shadow-sm">
              {slide.quote}
            </p>
          </div>
        </div>

        {/* ── Right: Form panel ──────────────────────────────────────── */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-8 py-8 md:py-6">
          <div className="w-full max-w-[320px]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}