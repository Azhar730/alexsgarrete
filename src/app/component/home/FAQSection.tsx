"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Inter, Fraunces } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const faqs = [
  {
    question: "What happens if I move to another state?",
    answer:
      "Your plan is fully transferable across all 50 states. We work with a nationwide network of trusted care facilities to ensure your dog receives the same quality of care no matter where you are.",
  },
  {
    question: "Can I update my dog's care instructions later?",
    answer:
      "Yes, you can update your dog's care instructions at any time through your online account. Changes take effect immediately and are reflected in your agreement.",
  },
  {
    question: "Is the agreement legally binding?",
    answer:
      "Absolutely. All Encore agreements are drafted and reviewed by licensed attorneys and are legally enforceable in all 50 states.",
  },
  {
    question: "What if I have multiple dogs?",
    answer:
      "We offer multi-pet plans that cover all your dogs under one agreement. Each dog gets a personalized care profile and designated caregiver.",
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="border-b border-gray-200 last:border-b-0 py-4 md:py-5 lg:py-6 cursor-pointer group"
      onClick={() => setOpen(!open)}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.5 }}
    >
      <div className="flex items-center justify-between gap-4">
        <span className={`${inter.className} text-base md:text-lg lg:text-xl font-medium text-gray-800 transition-colors group-hover:text-primary`}>
          {question}
        </span>
        <ChevronDown
          size={20}
          className={`text-gray-400 shrink-0 transition-all duration-300 ${open ? "rotate-180 text-primary" : "group-hover:text-primary"}`}
        />
      </div>
      {open && (
        <p className={`${inter.className} mt-3 md:mt-4 text-[0.95rem] md:text-base lg:text-lg text-gray-600 leading-relaxed md:pr-10`}>
          {answer}
        </p>
      )}
    </div>
  );
}

export default function FAQSection() {
  return (
    <section id="faq" className="mt-4 sm:mt-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 ">
        <h2 className={`${fraunces.className} text-3xl md:text-4xl lg:text-5xl font-semibold text-center text-primary mb-8 sm:mb-12`}>
          Frequently Asked Questions
        </h2>
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 px-5 sm:px-8 md:px-10 mx-auto">
          {faqs.map((faq) => (
            <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}