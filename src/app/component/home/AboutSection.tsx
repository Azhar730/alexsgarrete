"use client";

import { motion } from "framer-motion";
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

export default function AboutSection() {
  return (
    <section className="mt-4 sm:mt-20 bg-white p-4 container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-stretch gap-4 md:gap-6">

        {/* Left card — dog photo with white text bottom-left */}
        <motion.div
          className="relative rounded-3xl overflow-hidden flex-[1.53]"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.4 }}
        >
          <Image
            src="/dog-1.png"
            alt="Dog"
            width={1114}
            height={849}
            className="w-full h-auto md:h-full object-cover object-center"
          />
          {/* Dark gradient at bottom for text readability */}
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />

          {/* Overlay text — bottom-left */}
          <div className="absolute bottom-0 left-0 px-5 pb-6 sm:px-8 sm:pb-10 lg:px-12 lg:pb-12 w-full">
            <p
              className={`${fraunces.className} text-white font-medium leading-[1.15] text-[1.65rem] sm:text-3xl md:text-3xl lg:text-[2.75rem] drop-shadow-xl`}
            >
              Approximately 10% of dogs
              <br />
              are in shelters because their
              <br />
              owner passed away without a plan.
            </p>
          </div>
        </motion.div>

        {/* Right card — light blue bg with text top-left + cartoon dog */}
        <div className="relative rounded-3xl overflow-hidden flex-1 mt-4 md:mt-0">
          <Image
            src="/bg-dog.png"
            alt="Dog"
            width={726}
            height={849}
            className="w-full h-auto md:h-full object-cover object-center"
          />

          {/* Overlay text — top-left */}
          <div className="absolute top-0 left-0 px-5 pt-6 sm:px-8 sm:pt-10 lg:px-10 lg:pt-12 w-full">
            <p
              className={`${inter.className} font-medium leading-[1.35] text-[#3B7A8F] text-[1.4rem] sm:text-3xl md:text-2xl lg:text-[2.1rem] max-w-[95%]`}
            >
              Encore is your solution for permanent
              care for your fur baby should you
              pass away.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}