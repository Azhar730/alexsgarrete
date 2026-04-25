"use client";

import { useState } from "react";
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
    <div
      className="border-b border-gray-200 last:border-b-0 py-4 cursor-pointer"
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-medium text-gray-700">{question}</span>
        <ChevronDown
          size={18}
          className={`text-gray-400 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </div>
      {open && (
        <p className="mt-3 text-sm text-gray-500 leading-relaxed">{answer}</p>
      )}
    </div>
  );
}

export default function FAQSection() {
  return (
    <section id="faq" className="py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-700 mb-10">
          Frequently Asked Questions
        </h2>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6">
          {faqs.map((faq) => (
            <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}
