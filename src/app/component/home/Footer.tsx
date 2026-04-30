"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const menuLinks = [
  { label: "Home", href: "#home" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact Us", href: "#contact" },
];

const bottomLinks = [
  { label: "Terms & Conditions", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Accessibility Statement", href: "#" },
];

export default function Footer() {
  return (
    <div className=" container mx-auto px-4">
      <motion.footer
        className="bg-[#8dbce3] rounded-3xl mb-4 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.25 }}
      >

      {/* ── Main area ── */}
      <motion.div className="px-8 sm:px-12 lg:px-20 py-10 sm:py-14
                      grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6 items-start">

        <motion.div initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.12, duration: 0.5 }} viewport={{ once: true }}>
        <Image
          src="/encore-dog.png"
          alt="Encore dog mascot"
          width={301}
          height={267}
          className="object-contain"
        />
        </motion.div>

        {/* Center — Menu */}
        <motion.div className="flex flex-col items-center sm:items-start gap-1 mt-0 lg:mt-10" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.5 }} viewport={{ once: true }}>
          <h4
            className="text-[#3B4A8B] font-semibold mb-2"
            style={{ fontSize: "clamp(0.95rem, 1.4vw, 1.1rem)" }}
          >
            Menu
          </h4>
          {menuLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[#3B5070] hover:text-[#3B4A8B] transition-colors"
              style={{ fontSize: "clamp(0.8rem, 1.1vw, 0.92rem)" }}
            >
              {link.label}
            </Link>
          ))}
        </motion.div>

        {/* Right — Contact */}
        <motion.div className="flex flex-col items-center justify-center sm:items-start gap-1 mt-0 lg:mt-10" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.24, duration: 0.5 }} viewport={{ once: true }}>
          <h4
            className="text-[#3B4A8B] font-semibold mb-2"
            style={{ fontSize: "clamp(0.95rem, 1.4vw, 1.1rem)" }}
          >
            Contact
          </h4>
          <a
            href="mailto:contact@k9encore.com"
            className="text-[#3B5070] hover:text-[#3B4A8B] transition-colors"
            style={{ fontSize: "clamp(0.8rem, 1.1vw, 0.92rem)" }}
          >
            contact@k9encore.com
          </a>
        </motion.div>
      </motion.div>

      {/* ── Bottom bar — darker blue ── */}
      <motion.div className="bg-[#4e7db6] px-6 sm:px-10 lg:px-16 py-3" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.45 }} viewport={{ once: true }}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">

          {/* Left links */}
          <div className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-8">
            {bottomLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-white/90 hover:text-white transition-colors"
                style={{ fontSize: "clamp(0.65rem, 0.9vw, 0.78rem)" }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right — copyright */}
          <p
            className="text-white/90"
            style={{ fontSize: "clamp(0.65rem, 0.9vw, 0.78rem)" }}
          >
            ©2025 Encore LLC
          </p>
        </div>
      </motion.div>

      </motion.footer>
    </div>
  );
}