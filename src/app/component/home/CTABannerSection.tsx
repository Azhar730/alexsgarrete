"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function CTABannerSection() {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.section
        className="relative w-full min-h-[626px] rounded-3xl flex items-center overflow-hidden"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.25 }}
      >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/cta-banner.png"
          alt="Dogs playing in field"
          fill
          className="object-cover object-center"
        />
        {/* <div className="absolute inset-0 bg-black/40" /> */}
      </div>

      {/* Content — right aligned */}
      <div className="relative z-10 max-w-full  mx-auto px-4 sm:px-6 lg:px-8 w-full flex justify-end">
        <motion.div
          className="max-w-sm text-right"
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-6 drop-shadow">
            A Second Chance. A Lasting Legacy
          </h2>
          <div className="flex items-center justify-end gap-2">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button
                className="bg-primary text-white cursor-pointer transition-all duration-300 rounded-full px-8 py-6 text-xl font-semibold gap-2"
              >
                Get started
              </Button>
              </motion.div>
              <motion.span
                className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center"
                whileHover={{ x: 3 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <ArrowRight size={20} />
              </motion.span>
            </div>
        </motion.div>
      </div>
    </motion.section>
    </div>
  );
}
