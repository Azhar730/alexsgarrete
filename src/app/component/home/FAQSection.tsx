"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

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
    <motion.div
      className="border-b border-gray-200 last:border-b-0 py-4 cursor-pointer"
      onClick={() => setOpen(!open)}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.5 }}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-base sm:text-lg font-medium text-gray-800">{question}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={18} className="text-gray-400 shrink-0" />
        </motion.span>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.p
            key="answer"
            className="mt-3 text-base text-gray-600 leading-7 overflow-hidden"
            initial={{ opacity: 0, height: 0, y: -4 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -4 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {answer}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQSection() {
  return (
    <motion.section
      id="faq"
      className="py-16 bg-white"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-3xl sm:text-4xl font-bold text-center text-primary mb-10"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          viewport={{ once: true }}
        >
          Frequently Asked Questions
        </motion.h2>
        <motion.div
          className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.55 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          {faqs.map((faq) => (
            <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
