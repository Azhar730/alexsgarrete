"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const features = [
  { src: "/feature-1.png", title: "Secure care\nplanning" },
  { src: "/feature-2.png", title: "Trusted facility\nhandling" },
  { src: "/feature-3.png", title: "Legally backed\nagreement" },
  { src: "/feature-4.png", title: "Monthly flexible\nplan" },
];

export default function FeaturesSection() {
  return (
    <div className="container mx-auto px-4 ">
      <motion.div
        className="bg-gray-100 p-6 rounded-3xl"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.25 }}
      >
        <motion.h2
          className="text-3xl font-bold text-center text-secondary mb-12"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          viewport={{ once: true }}
        >
          Features
        </motion.h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              className="relative flex-shrink-0"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ y: -6 }}
            >
              <Image
                src={feature.src}
                alt={feature.title}
                width={294}
                height={849}
              />
              {/* Text overlay — bottom-center, exactly like 2nd image */}
              <p
                className="absolute bottom-10 lg:bottom-16 left-0 right-0 text-center text-white px-2 leading-snug text-xl lg:text-2xl"
                style={{
                  fontWeight: 400,
                  whiteSpace: "pre-line",
                }}
              >
                {feature.title}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}