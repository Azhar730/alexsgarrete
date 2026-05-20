"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight, ShieldCheck, Heart, Sparkles } from "lucide-react";
import { inter } from "@/app/fonts";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const router = useRouter();

  return (
    <div className="bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-slate-200/60 max-w-xl w-full text-center border border-white/50 relative overflow-hidden">
      {/* Glow effects */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#85A1D1]/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-100/30 rounded-full blur-3xl" />

      {/* Success Icon */}
      <div className="w-24 h-24 bg-linear-to-tr from-emerald-400 to-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-200 relative animate-bounce-slow">
        <CheckCircle2 className="w-12 h-12" strokeWidth={2} />
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full text-emerald-600 text-xs font-bold tracking-wide mb-4 uppercase">
        <Sparkles className="w-3.5 h-3.5" /> Premium Coverage Activated
      </div>

      <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight leading-none">
        Payment Successful!
      </h1>
      
      <p className="text-slate-500 mb-8 leading-relaxed font-medium text-sm md:text-base px-4">
        Thank you for your payment. Your pet&apos;s insurance policy is now fully active! A confirmation receipt and policy documents have been sent to your registered email address.
      </p>

      {/* Highlights */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-slate-50/50 backdrop-blur-sm border border-slate-100/80 rounded-2xl p-4 text-left">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mb-2">
            <ShieldCheck className="w-4 h-4 text-[#85A1D1]" />
          </div>
          <h4 className="text-xs font-bold text-slate-700 mb-0.5">Fully Secured</h4>
          <p className="text-[11px] text-slate-400">Underwritten & fully covered</p>
        </div>
        <div className="bg-slate-50/50 backdrop-blur-sm border border-slate-100/80 rounded-2xl p-4 text-left">
          <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center mb-2">
            <Heart className="w-4 h-4 text-pink-400" />
          </div>
          <h4 className="text-xs font-bold text-slate-700 mb-0.5">Caring Support</h4>
          <p className="text-[11px] text-slate-400">24/7 dedicated support team</p>
        </div>
      </div>

      {/* Transaction ID Display */}
      {sessionId && (
        <div className="bg-slate-50 rounded-2xl p-4 mb-8 border border-slate-100/60 max-w-sm mx-auto">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Transaction Session</p>
          <p className="text-[11px] font-mono text-slate-600 truncate px-2 selection:bg-slate-200">{sessionId}</p>
        </div>
      )}

      <button 
        onClick={() => router.push("/dashboard")}
        className="w-full bg-[#85A1D1] hover:bg-[#6c8abf] text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#85A1D1]/30 hover:shadow-[#85A1D1]/40 hover:-translate-y-0.5 active:translate-y-0"
      >
        Go to Dashboard <ArrowRight className="w-5 h-5 ml-1" />
      </button>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className={`min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 relative overflow-hidden ${inter.className}`}>
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#85A1D1]/10 to-transparent pointer-events-none" />
      
      {/* Interactive geometric background blobs */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-[#85A1D1]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-emerald-100/10 rounded-full blur-3xl pointer-events-none" />

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
