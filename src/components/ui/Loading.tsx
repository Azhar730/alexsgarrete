"use client";

import { motion } from "framer-motion";

interface LoadingProps {
  message?: string;
  subMessage?: string;
  fullScreen?: boolean;
}

export function Loading({ 
  message = "Loading...", 
  subMessage = "Please wait a moment", 
  fullScreen = false 
}: LoadingProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${fullScreen ? "fixed inset-0 bg-white z-50" : "min-h-[60vh] w-full"}`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative flex items-center justify-center"
      >
        {/* Outer Pulsing Ring */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-20 h-20 rounded-full border-2 border-[#85A1D1]"
        />
        
        {/* Inner Spinning Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
          className="w-12 h-12 rounded-full border-4 border-t-[#85A1D1] border-r-transparent border-b-transparent border-l-transparent"
        />
      </motion.div>

      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-6 text-center"
      >
        <motion.h2
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-xl font-medium text-gray-800"
        >
          {message}
        </motion.h2>
        {subMessage && (
          <p className="text-gray-500 mt-1 text-sm">{subMessage}</p>
        )}
      </motion.div>
    </div>
  );
}
