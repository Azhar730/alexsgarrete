"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { XCircle, ArrowLeft, AlertCircle } from "lucide-react";
import { inter } from "@/app/fonts";

function CancelContent() {
  const router = useRouter();

  return (
    <div className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl shadow-none max-w-xl w-full text-center border border-slate-100 relative overflow-hidden">
      {/* Soft background accent */}
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-40 h-40 bg-red-500/8 rounded-full blur-3xl" />

      {/* Cancel Icon */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-linear-to-tr from-red-400 to-red-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-none relative">
        <XCircle className="w-10 h-10 sm:w-12 sm:h-12" strokeWidth={2} />
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 rounded-full text-red-600 text-[11px] sm:text-xs font-bold tracking-wide mb-3 sm:mb-4 uppercase">
        <AlertCircle className="w-3.5 h-3.5" /> Payment Cancelled
      </div>

      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 sm:mb-4 tracking-tight leading-tight">
        Checkout Incomplete
      </h1>
      
      <p className="text-slate-500 mb-6 sm:mb-8 leading-relaxed font-medium text-sm sm:text-base px-2 sm:px-4 max-w-lg mx-auto">
        Your payment process was cancelled and no charges were made to your account. You can return to your dashboard to try again when you are ready.
      </p>

      <button 
        onClick={() => router.push("/dashboard")}
        className="w-full bg-[#85A1D1] hover:bg-[#6c8abf] text-white font-bold py-3.5 sm:py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 shadow-none"
      >
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1" /> Return to Dashboard
      </button>
    </div>
  );
}

export default function CancelPage() {
  return (
    <div className={`min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 relative overflow-hidden ${inter.className}`}>
      <div className="absolute top-0 left-0 w-full h-72 bg-linear-to-b from-red-500/8 to-transparent pointer-events-none" />

      <Suspense fallback={
        <div className="animate-pulse flex flex-col items-center gap-5">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-red-500 font-black uppercase tracking-widest text-xs">Loading...</p>
        </div>
      }>
        <CancelContent />
      </Suspense>
    </div>
  );
}
