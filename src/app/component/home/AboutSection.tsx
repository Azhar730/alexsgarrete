"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutSection() {
  return (
    <section className="py-6 bg-white p-4 container mx-auto px-4">
      <div className="flex items-stretch gap-4">

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
            className="w-full h-full object-cover"
          />
          {/* Dark gradient at bottom for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

          {/* Overlay text — bottom-left */}
          <div className="absolute bottom-0 left-0 px-6 pb-6 sm:px-8 sm:pb-8">
            <motion.p
              className="text-white font-bold leading-snug text-xl md:text-2xl lg:text-4xl"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              viewport={{ once: true }}
            >
              Approximately 10% of dogs
              <br />
              are in shelters because their
              <br />
              owner passed away without a plan.
            </motion.p>
          </div>
        </motion.div>

        {/* Right card — light blue bg with text top-left + cartoon dog */}
        <motion.div
          className="relative rounded-3xl overflow-hidden flex-[1]"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.08 }}
          viewport={{ once: true, amount: 0.4 }}
        >
          <Image
            src="/bg-dog.png"
            alt="Dog"
            width={726}
            height={849}
            className="w-full h-full object-cover"
          />

          {/* Overlay text — top-left */}
          <div className="absolute top-0 left-0 px-6 pt-6 sm:px-7 sm:pt-7 max-w-[85%]">
            <motion.p
              className="font-semibold leading-snug text-[#3B7A8F] text-xl md:text-2xl lg:text-4xl"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24, duration: 0.5 }}
              viewport={{ once: true }}
            >
              Encore is your solution for permanent
              <br />
              care for your fur baby should you
              <br />
              pass away.
            </motion.p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}