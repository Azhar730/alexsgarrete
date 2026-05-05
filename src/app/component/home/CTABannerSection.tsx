"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Fraunces, Inter } from "next/font/google";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export default function CTABannerSection() {
  return (
    <div className="container mx-auto px-4 mt-4 sm:mt-20">
      <section className="relative w-full min-h-[450px] sm:min-h-[500px] md:min-h-[626px] rounded-3xl flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/cta-banner.png"
            alt="Dogs playing in field"
            fill
            className="object-cover object-[70%_center] sm:object-center"
          />
          {/* Soft gradient to make the text pop better without darkening the whole image */}
          <div className="absolute inset-0 bg-linear-to-l from-black/60 via-black/10 to-transparent pointer-events-none" />
        </div>

        {/* Content — right aligned */}
        <div className="relative z-10 w-full mx-auto px-6 sm:px-10 lg:px-16 flex justify-end">
          <div className="text-right">
            <h2 className={`${fraunces.className} text-[2.2rem] sm:text-5xl lg:text-[4rem] font-bold text-white leading-[1.1] mb-6 sm:mb-8 drop-shadow-xl`}>
              A Second Chance,<br />A Lasting Legacy
            </h2>
            <div className="flex items-center justify-end gap-3 sm:gap-4">
              <Button
                className={`${inter.className} bg-primary hover:bg-[#4a5aa8] text-white cursor-pointer transition-all duration-300 rounded-full px-6 py-6 sm:px-8 sm:py-7 text-base sm:text-xl font-semibold shadow-lg hover:scale-105`}
              >
                Get started
              </Button>
              <span className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer shrink-0">
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
