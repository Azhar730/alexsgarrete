"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { inter } from "@/app/fonts";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const router = useRouter();

  return (
    <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl shadow-slate-200/50 max-w-lg w-full text-center border border-slate-100 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -z-10" />

      {/* Success Icon */}
      <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner shadow-emerald-200/50 relative">
        <div className="absolute inset-0 rounded-full border-4 border-white" />
        <CheckCircle2 className="w-12 h-12" strokeWidth={2.5} />
      </div>

      <h1 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Payment Successful!</h1>
      <p className="text-slate-500 mb-8 leading-relaxed font-medium">
        Thank you for your payment. Your pet's coverage is now active! We've sent a confirmation receipt to your email address.
      </p>

      {/* Transaction ID Display */}
      {sessionId && (
        <div className="bg-slate-50 rounded-2xl p-5 mb-10 border border-slate-100">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Transaction Session</p>
          <p className="text-xs font-mono text-slate-600 truncate px-2">{sessionId}</p>
        </div>
      )}

      <button 
        onClick={() => router.push("/dashboard")}
        className="w-full bg-[#85A1D1] hover:bg-[#6c8abf] text-white font-bold py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#85A1D1]/30 hover:shadow-[#85A1D1]/40"
      >
        Go to Dashboard <ArrowRight className="w-5 h-5 ml-1" />
      </button>
    </div>
  );
}

export default function ConnectSuccessPage() {
  return (
    <div className={`min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 relative ${inter.className}`}>
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#85A1D1]/10 to-transparent pointer-events-none" />
      
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
