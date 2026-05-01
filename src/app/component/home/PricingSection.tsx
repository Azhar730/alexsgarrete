"use client";

import { motion } from "framer-motion";
import { PawPrint, Check } from "lucide-react";
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

const plans = [
  {
    icon: PawPrint,
    title: "Personalized Plans",
    description: "Plans are personalized based on your dog and information.",
    highlight: false,
  },
  {
    icon: Check,
    title: "No Pressure Commitment",
    description: "No commitment until you review your plan.",
    highlight: false,
  },
];

export default function PricingSection() {
  return (
    <div className="container mx-auto px-4 mt-4 sm:mt-20">
      <section id="pricing" className="py-16 bg-primary rounded-3xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`${inter.className} text-3xl md:text-4xl lg:text-5xl font-bold text-center text-white mb-10`}>Transparent Pricing</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {plans.map((plan) => {
              const Icon = plan.icon;
              return (
                <div
                  key={plan.title}
                  className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 flex flex-col items-center text-center gap-4 border border-white/20 hover:bg-white/30 transition-colors"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                  viewport={{ once: true, amount: 0.3 }}
                  whileHover={{ y: -6 }}
                >
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <Icon className="text-white" size={22} />
                  </div>
                  <h3 className={`${inter.className} text-white font-bold text-lg md:text-xl`}>{plan.title}</h3>
                  <p className={`${inter.className} text-white/80 text-sm md:text-base leading-relaxed`}>{plan.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
