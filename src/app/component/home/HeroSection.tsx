import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "./button";

export default function HeroSection() {
  return (
    <div className="p-4 mt-6">
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
        <div className="absolute bottom-0 left-0 px-8 pb-8 sm:px-10 sm:pb-10 lg:px-12 lg:pb-12">
          <h1
            className="text-white leading-[1.06] text-4xl sm:text-6xl lg:text-8xl drop-shadow-lg max-w-[90vw]"
            
          >
            Loving Care When
            <br />
            You&apos;re No Longer
            <br />

            {/* Last line: "There" + inline CTA */}
            <span className="inline-flex items-center gap-3 flex-wrap">
              <span>There</span>

              <div className="absolute bottom-4 left-65">
            <div className="flex items-center gap-2">
              <Button
                className="bg-primary text-white cursor-pointer transition-all duration-300 rounded-full px-8 py-6 text-xl font-semibold gap-2"
              >
                Get started
              </Button>
              <span className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center">
                <ArrowRight size={20} />
              </span>
            </div>
          </div>
            </span>
          </h1>
        </div>

      </div>
    </div>
  );
}