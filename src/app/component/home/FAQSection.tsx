"use client";

import { useState, ReactNode } from "react";
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

const faqs: { question: string; answer: ReactNode }[] = [
  {
    question: "What does Encore do?",
    answer: "Encore offers second chances and kept promises to care for your dog(s) when you are no longer around to do so. We do this through a \"Pet Guardianship Transfer Agreement\" which allows us to take guardianship/ownership of your dog(s) in the event of your passing."
  },
  {
    question: "Where will my dog(s) live?",
    answer: "Encore realizes that the preferred scenario for all dogs is to be re-homed into a new loving family which we will try to do. We also realize statistically that this happens far less often than one would hope with as little as 25% of senior dogs being re-homed from shelters. Should your dog not be re-homed, Encore is dedicated to ensuring your dog(s) receive the best life possible spending their remaining years in one of our sanctuaries or affiliated facilities."
  },
  {
    question: "How will my dog(s) be transferred to your facility?",
    answer: "Either Encore will either pick up your dog from it's current location or we will coordinate with a shipping company that specializes in K9 transport to deliver your dog(s) to one of our facilities."
  },
  {
    question: "What is the Transport Fee?",
    answer: "At the time of entering the agreement, a Transport fee will be collected. This fee almost certainly not cover the entire cost to transport the dog(s) to an Encore facility, but will subsidize those expenses."
  },
  {
    question: "How will you be notified of my passing?",
    answer: "In the contract, you will nominate a Designated Representative who will notify us of your passing at which time our team will initiate our processes."
  },
  {
    question: "What does the Designated Representative need to provide?",
    answer: "The Designated Representative needs to provide Encore with a copy of the death certificate, provide the location of the dog(s), and provide access if the dog(s) are not in he/she's possession."
  },
  {
    question: "Will you provide the Designated Representative a packet of information?",
    answer: "Yes, each Designated Representative will receive a packet of information which outlines his/her responsibilities, the information we need them to procure and provide to us, as well as contact details for Encore."
  },
  {
    question: "What will my monthly payments be?",
    answer: "The monthly cost varies drastically depending on numerous factors but are mostly heavily impacted by your age and the age and breed of your dog."
  },
  {
    question: "How are payments calculated?",
    answer: (
      <>
        Monthly payments are calculated using many factors including:
        <ul className="list-disc pl-6 mt-3 space-y-1">
          <li>Age of Client</li>
          <li>General Health of Client</li>
          <li>Age of Dog(s)</li>
          <li>Breed of Dog(s)</li>
          <li>Average Lifespan of Breed(s)</li>
          <li>Average Cost to Feed Breed(s)</li>
          <li>Average Cost to Shelter Breed(s)</li>
          <li>Average Cost to Provide Medical Care for the Breed(s)</li>
          <li>Average Cost to Provide Supervision</li>
        </ul>
      </>
    )
  },
  {
    question: "How will I make my payments?",
    answer: "In order to keep the contract current, we require all customers to sign up for automatic payments. We offer ACH/Electronic Bank Payments as well as Debit and Credit Cards."
  },
  {
    question: "What are the fees for the different payment types?",
    answer: "ACH/Electronic Bank Payments will incur no fees. Debit Cards and Credit Cards will incur a fee of 2.5%"
  },
  {
    question: "Are there taxes on my payments?",
    answer: "No, there is no sales tax on your monthly fees."
  },
  {
    question: "Does my dog(s) have to be spayed or neutered?",
    answer: "Yes, all dogs are required to be spayed or neutered to be re-homed or live in an Encore owned or affiliated facility. If your dog is not spayed/neutered, a fee will be collected at the time of execution to cover the cost of the procedure."
  },
  {
    question: "Who will make decisions when it is time to decide if end of life care is the best option?",
    answer: "Encore will likely be required to make end of life care decisions for Client dog(s). Encore will consult with veterinary professionals to assess quality of life to determine the best care for your dog(s). In the event your dog(s) is suffering from catastrophic injury, degenerative disease, terminal illnesses or some other condition that impacts quality of life, Encore and veterinary professionals will decide the best course of care, which may include pain management up to compassionate euthanasia."
  },
  {
    question: "Is this Life Insurance?",
    answer: "No, this is not Life Insurance but is a \"Pet Guardianship Transfer Agreement\""
  },
  {
    question: "Is this agreement transferable?",
    answer: "No, this agreement is not transferable to any other person or dog(s)."
  },
  {
    question: "Does this agreement have any cash value?",
    answer: "No, this agreement has no cash value."
  }
];

function FAQItem({ question, answer }: { question: string; answer: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="border-b border-gray-200 last:border-b-0 py-4 md:py-5 lg:py-6 cursor-pointer group"
      onClick={() => setOpen(!open)}
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
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className={`${inter.className} mt-3 md:mt-4 text-[0.95rem] md:text-base lg:text-lg text-gray-600 leading-relaxed md:pr-10 pb-2`}>
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQSection() {
  return (
    <section id="faq" className="mt-4 sm:mt-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-20">
        <h2 className={`${fraunces.className} text-3xl md:text-4xl lg:text-5xl font-semibold text-center text-primary mb-8 sm:mb-12`}>
          Frequently Asked Questions
        </h2>
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 px-5 sm:px-8 md:px-10 mx-auto ">
          {faqs.map((faq) => (
            <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}