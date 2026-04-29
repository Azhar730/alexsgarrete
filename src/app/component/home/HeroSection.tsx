import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "./button";

export default function HeroSection() {
  return (
    <div className="px-4 mt-6 py-2 lg:mt-12 container mx-auto">
      <div className="relative rounded-3xl overflow-hidden">
        <Image
          src="/hero-bg.png"
          alt="Dog running in field"
          width={1870}
          height={1080}
          className="w-full object-cover object-center"
          priority
        />

        {/* Text Overlay — bottom-left */}
        <div className="absolute bottom-0 left-0 px-4 pb-4 sm:px-8 sm:pb-8 lg:px-12 lg:pb-12">
          <h1 className="text-white leading-[1.06] drop-shadow-lg
                         text-[clamp(1.1rem,4.5vw,5rem)]">
            Loving Care When
            <br />
            You&apos;re No Longer
            <br />

            {/* Last line: "There" + inline CTA */}
            <span className="inline-flex items-center gap-2 sm:gap-3 flex-wrap">
              <span>There</span>

              {/* CTA buttons — scale with viewport */}
              <span className="inline-flex items-center gap-1 sm:gap-2 mt-5">
                <Button
                  className="bg-primary text-white cursor-pointer transition-all duration-300
                             rounded-full font-semibold
                             px-3 py-2 text-[10px]
                             sm:px-5 sm:py-3 sm:text-sm
                             md:px-6 md:py-4 md:text-base
                             lg:px-8 lg:py-6 lg:text-xl"
                >
                  Get started
                </Button>
                <span className="rounded-full bg-white text-black flex items-center justify-center flex-shrink-0
                                 w-6 h-6
                                 sm:w-8 sm:h-8
                                 md:w-10 md:h-10
                                 lg:w-12 lg:h-12">
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                </span>
              </span>
            </span>
          </h1>
        </div>

      </div>
    </div>
  );
}