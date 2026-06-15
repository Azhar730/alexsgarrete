import { AuthSlide } from "@/app/data/authConfig";
import { inter } from "@/app/fonts";
import Image from "next/image";
import Link from "next/link";

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
    <div className={`min-h-screen w-full bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 ${inter.className}`}>

      <div className="w-full max-w-5xl bg-white rounded-lg  flex flex-col md:flex-row min-h-[500px] lg:min-h-[640px] my-auto">

        {/* ── Left: Image panel ──────────────────────────────────────── */}
        <div className="relative md:w-[45%] min-h-[200px] md:min-h-0 shrink-0 m-3 rounded-[20px] overflow-hidden">

          {/* Background image */}
          <Image
            src={slide.image}
            alt={slide.alt}
            fill
            className="object-cover object-center"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />

          {/* Dark gradient overlay at bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Logo badge */}
          <div className="absolute top-6 left-6 z-10">
            <Link href="/">
              <Image
                src="/encore.png"
                alt="Encore logo"
                width={120}
                height={38}
                className="h-auto w-auto"
              />
            </Link>
          </div>

          {/* Quote text */}
          <div className="absolute bottom-8 left-6 right-6 z-10">
            <p className="text-white font-semibold text-2xl lg:text-3xl leading-snug whitespace-pre-line drop-shadow-md">
              {slide.quote}
            </p>
          </div>
        </div>

        {/* ── Right: Form panel ──────────────────────────────────────── */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-10 md:py-12">
          <div className="w-full max-w-[400px]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}