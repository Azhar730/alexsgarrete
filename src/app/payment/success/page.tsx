"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { inter } from "@/app/fonts";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const router = useRouter();

  return (
    <div className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl shadow-none max-w-xl w-full text-center border border-slate-100 relative overflow-hidden">
      {/* Soft background accent */}
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-40 h-40 bg-[#85A1D1]/8 rounded-full blur-3xl" />

      {/* Success Icon */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-linear-to-tr from-emerald-400 to-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-none relative">
        <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" strokeWidth={2} />
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full text-emerald-600 text-[11px] sm:text-xs font-bold tracking-wide mb-3 sm:mb-4 uppercase">
        <Sparkles className="w-3.5 h-3.5" /> Premium Coverage Activated
      </div>

      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 sm:mb-4 tracking-tight leading-tight">
        Payment Successful!
      </h1>
      
      <p className="text-slate-500 mb-6 sm:mb-8 leading-relaxed font-medium text-sm sm:text-base px-2 sm:px-4 max-w-lg mx-auto">
        Thank you for your payment. Your pet&apos;s insurance policy is now fully active! A confirmation receipt and policy documents have been sent to your registered email address.
      </p>

      {/* Transaction ID Display */}
      {sessionId && (
        <div className="bg-slate-50 rounded-xl p-3 sm:p-4 mb-6 sm:mb-8 border border-slate-100 max-w-sm mx-auto">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Transaction Session</p>
          <p className="text-[11px] sm:text-xs font-mono text-slate-600 truncate px-1 sm:px-2 selection:bg-slate-200">{sessionId}</p>
        </div>
      )}

      <button 
        onClick={() => router.push("/dashboard")}
        className="w-full bg-[#85A1D1] hover:bg-[#6c8abf] text-white font-bold py-3.5 sm:py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 shadow-none"
      >
        Go to Dashboard <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1" />
      </button>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className={`min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 relative overflow-hidden ${inter.className}`}>
      <div className="absolute top-0 left-0 w-full h-72 bg-linear-to-b from-[#85A1D1]/8 to-transparent pointer-events-none" />

      <Suspense fallback={
        <div className="animate-pulse flex flex-col items-center gap-5">
          <div className="w-16 h-16 border-4 border-[#85A1D1] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#85A1D1] font-black uppercase tracking-widest text-xs">Verifying Payment...</p>
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
