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

const features = [
  { src: "/feature-1.png", title: "Secure care\nplanning" },
  { src: "/feature-2.png", title: "Trusted facility\nhandling" },
  { src: "/feature-3.png", title: "Legally backed\nagreement" },
  { src: "/feature-4.png", title: "Monthly flexible\nplan" },
];

export default function FeaturesSection() {
  return (
    <div id="features" className="container mx-auto px-4 mt-4 sm:mt-20 ">
      <div className="bg-gray-100 p-6 md:p-10 rounded-3xl">
        <h2 className={`${inter.className} text-3xl md:text-4xl lg:text-5xl  text-center text-[#718EBE] mb-10`}>Features</h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 max-w-7xl mx-auto">
          {features.map((feature) => (
            <div key={feature.title} className="relative shrink-0 rounded-2xl overflow-hidden group">
              <Image
                src={feature.src}
                alt={feature.title}
                width={294}
                height={849}
                className="w-full h-auto object-cover transition-transform duration-700 "
              />

              <p
                className={`${inter.className} absolute bottom-6 md:bottom-10 lg:bottom-16 left-0 right-0 text-center text-white px-3 leading-[1.2] text-lg sm:text-xl lg:text-[1.65rem] drop-shadow-md`}
                style={{
                  fontWeight: 500,
                  whiteSpace: "pre-line",
                }}
              >
                {feature.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}