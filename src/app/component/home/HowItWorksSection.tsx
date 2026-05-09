"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const cardMotion = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  viewport: { once: true, amount: 0.35 },
};

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className={`px-4 sm:px-4 mt-4 sm:mt-20 bg-white container mx-auto ${inter.className}`}>

      {/* Row 1 */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">

        {/* Card 1 — "How it works" label */}
        <motion.div className="sm:flex-[1.2] min-w-0 relative rounded-2xl overflow-hidden min-h-30 sm:min-h-0" {...cardMotion}>
          <Image
            src="/how-works.png"
            alt="How it works"
            width={444}
            height={300}
            className="w-full h-full object-cover"
          />
          <motion.div className="absolute inset-0 flex flex-col items-center justify-center px-3" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.15, duration: 0.4 }} viewport={{ once: true }}>
            <h2 className="text-primary font-bold leading-tight mb-1 text-center text-4xl md:text-2xl">
              How it works
            </h2>
            <p className="text-muted-foreground text-center leading-snug text-lg">
              A simple process designed to<br />secure your dog&apos;s future care
            </p>
          </motion.div>
        </motion.div>

        {/* Card 2 — Submit your information */}
        <motion.div className="sm:flex-[1.6] min-w-0 relative rounded-2xl overflow-hidden min-h-30 sm:min-h-0" {...cardMotion} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay: 0.08 }}>
          <Image
            src="/submit-information.png"
            alt="Submit Information"
            width={557}
            height={300}
            className="w-full h-full object-cover"
          />
          <motion.div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-5 py-3 sm:py-4" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.18, duration: 0.4 }} viewport={{ once: true }}>
            <span className="w-6 h-6 rounded-full bg-white text-primary text-sm font-bold flex items-center justify-center">
              1
            </span>
            <p className="text-white font-bold leading-tight text-4xl">
              Submit your<br />information
            </p>
          </motion.div>
        </motion.div>

        {/* Card 3 — Receive your personalized plan */}
        <motion.div className="sm:flex-[2.4] min-w-0 relative rounded-2xl overflow-hidden min-h-30 sm:min-h-0" {...cardMotion} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay: 0.16 }}>
          <Image
            src="/recive-plan.png"
            alt="Receive your personalized plan"
            width={821}
            height={300}
            className="w-full h-full object-cover"
          />
          <motion.div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-5 py-3 sm:py-4" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.22, duration: 0.4 }} viewport={{ once: true }}>
            <div className="flex justify-end">
              <span className="w-6 h-6 rounded-full bg-white text-primary text-sm font-bold flex items-center justify-center">
                2
              </span>
            </div>
            <p className="text-white font-bold leading-tight text-right text-4xl">
              Receive your<br />personalized plan
            </p>
          </motion.div>
        </motion.div>

      </div>

      {/* Row 2 */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full mt-3 sm:mt-4">

        {/* Card 4 — Dogs photo (no text overlay) */}
        <motion.div className="sm:flex-[1.6] min-w-0 relative rounded-2xl overflow-hidden min-h-30 sm:min-h-0" {...cardMotion} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay: 0.08 }}>
          <Image
            src="/dogs.png"
            alt="Dogs in park"
            width={557}
            height={300}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Card 5 — Review and sign agreement */}
        <motion.div className="sm:flex-[1.6] min-w-0 relative rounded-2xl overflow-hidden min-h-30 sm:min-h-0" {...cardMotion} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay: 0.16 }}>
          <Image
            src="/review-agreement.png"
            alt="Review and sign agreement"
            width={557}
            height={300}
            className="w-full h-full object-cover"
          />
          <motion.div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-5 py-3 sm:py-4" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.4 }} viewport={{ once: true }}>
            <span className="w-6 h-6 rounded-full bg-white text-primary text-sm font-bold flex items-center justify-center">
              3
            </span>
            <p className="text-white font-bold leading-tight text-4xl">
              Review and sign<br />agreement
            </p>
          </motion.div>
        </motion.div>

        {/* Card 6 — Activate your plan */}
        <motion.div className="sm:flex-[2.1] min-w-0 relative rounded-2xl overflow-hidden min-h-30 sm:min-h-0" {...cardMotion} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay: 0.24 }}>
          <Image
            src="/activate-plan.png"
            alt="Activate your plan"
            width={708}
            height={300}
            className="w-full h-full object-cover"
          />
          <motion.div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-5 py-3 sm:py-4" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.26, duration: 0.4 }} viewport={{ once: true }}>
            <div className="flex justify-end">
              <span className="w-6 h-6 rounded-full bg-white text-primary text-sm font-bold flex items-center justify-center">
                4
              </span>
            </div>
            <p className="text-white font-bold leading-tight text-right text-4xl">
              Activate your<br />plan
            </p>
          </motion.div>
        </motion.div>

      </div>

    </section>
  );
}