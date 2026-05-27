"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "./button";
import { Fraunces } from "next/font/google";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export default function HeroSection() {
  return (
    <div id="home" className="px-4 py-2 container mx-auto">
      <div className="relative rounded-3xl overflow-hidden w-full min-h-120 sm:min-h-137.5 md:min-h-150 lg:min-h-175 flex items-end">
        {/* Background Image Under Text */}
        <Image
          src="/hero-bg.png"
          alt="Dog running in field"
          fill
          className="object-cover object-[70%_top] sm:object-center"
          priority
        />

        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

        {/* Text Overlay — bottom-left */}
        <div className="relative z-10 w-full px-5 pb-6 sm:px-10 sm:pb-12 lg:px-16 lg:pb-16">
          <h1 className={`${fraunces.className} text-white leading-[1.1] drop-shadow-xl text-[2.5rem] sm:text-5xl md:text-6xl lg:text-[5.5rem]`}>
            Loving Care When
            <br />
            You&apos;re No Longer
            <br />

            {/* Last line: "There" + inline CTA */}
            <span className="flex items-center flex-wrap gap-3 sm:gap-6 mt-3 sm:mt-4">
              <span>There</span>

              {/* CTA buttons */}
              <span className="flex items-center gap-2 sm:gap-4 mt-1 sm:mt-0">
                <Button
                  className="bg-[#85A1D1] hover:bg-[#85A1D1] text-white cursor-pointer transition-all duration-300
                             rounded-full font-semibold border-none
                             px-5 py-5 text-sm
                             sm:px-6 sm:py-6 sm:text-base
                             lg:px-8 lg:py-7 lg:text-xl
                             hover:scale-105 shadow-lg"
                >
                  Get started
                </Button>
                <span className="rounded-full bg-white text-black flex items-center justify-center shrink-0 cursor-pointer
                                 w-10 h-10
                                 sm:w-12 sm:h-12
                                 lg:w-14 lg:h-14
                                 hover:scale-105 transition-transform shadow-lg">
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                </span>
              </span>
            </span>
          </h1>
        </div>
      </div>
    </div>
  );
}