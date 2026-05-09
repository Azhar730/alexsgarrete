/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Shield, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import StepIndicator from "./StepIndicator";
import PaymentHeader from "./PamentHeader";
import Image from "next/image";
import { useGetMyQuotesQuery, useReviewQuoteMutation } from "@/redux/api/onboardingApi";
import { toast } from "sonner";

const declineReasons = [
  { id: "too-expensive", label: "Too expensive" },
  { id: "not-what-i-wanted", label: "Not what I wanted" },
  { id: "not-ready", label: "Not ready to purchase yet" },
  { id: "other", label: "Other reason" },
];

export default function QuoteReviewCard() {
  const router = useRouter();
  const { data: quotesResponse, isLoading } = useGetMyQuotesQuery(undefined);
  const [reviewQuote, { isLoading: isReviewing }] = useReviewQuoteMutation();
  const [showConfirmDecline, setShowConfirmDecline] = useState(false);
  const [showDeclinedSuccess, setShowDeclinedSuccess] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const quotes = quotesResponse?.data || [];
  const quoteGroup = quotes[0];
  const firstQuote = quoteGroup?.quotes?.[0];
  const pet = firstQuote?.pet;
  const petCount = quoteGroup?.quotes?.length || 0;
  const quoteGroupId = quoteGroup?.quoteGroupId;

  const monthlyPremium = quoteGroup?.totalMonthlyCharge || 0;
  const setupFee = quoteGroup?.setupFee || 0;

  const handleAccept = async () => {
    try {
      if (!quoteGroupId) {
        toast.error("Quote ID not found");
        return;
      }
      await reviewQuote({
        quoteGroupId,
        action: "accept",
      }).unwrap();
      toast.success("Quote accepted successfully");
      router.push("/dashboard/quote/agreement");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to accept quote");
    }
  };

  const handleDecline = async () => {
    try {
      if (!quoteGroupId) {
        toast.error("Quote ID not found");
        return;
      }
      
      // Get the label for the selected reason
      const reasonLabel = declineReasons.find(r => r.id === declineReason)?.label || declineReason;
      
      await reviewQuote({
        quoteGroupId,
        action: "reject",
        rejectionReason: reasonLabel || additionalNotes || "No reason provided",
      }).unwrap();
      
      setShowConfirmDecline(false);
      setShowDeclinedSuccess(true);
      toast.success("Quote declined");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to decline quote");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <p className="text-slate-500">Loading quote...</p>
      </div>
    );
  }

  if (!quoteGroup || !pet) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <p className="text-slate-500">No quote found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center px-4">
      {/* Logo */}
      <PaymentHeader />
      <StepIndicator currentStep={1} />

      <div className="bg-white rounded-2xl border border-primary p-6 shadow-sm">
        <h2 className="text-xl font-bold text-secondary mb-1">
          Review Your Quote
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          {petCount > 1 
            ? `Review coverage and payment summary for ${petCount} pets before you continue to the agreement and payment step.`
            : `Review ${pet.name}'s coverage and payment summary before you continue to the agreement and payment step.`
          }
        </p>

        {/* Pet(s) info */}
        {petCount === 1 ? (
          <div className="flex items-center gap-3 pb-5 border-b border-slate-100 mb-5">
            <Image
              src={pet.photoUrl || "https://images.unsplash.com/photo-1552053831-71594a27632d?w=64&h=64&fit=crop"}
              alt={pet.name}
              width={56}
              height={56}
              className="rounded-full object-cover ring-2 ring-primary"
            />
            <div>
              <p className="font-bold text-secondary">{pet.name}</p>
              <p className="text-xs text-muted-foreground">
                {pet.primaryBreed} • {new Date(pet.birthday).getFullYear() !== new Date().getFullYear() 
                  ? `${new Date().getFullYear() - new Date(pet.birthday).getFullYear()} years old`
                  : "Less than 1 year old"
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="pb-5 border-b border-slate-100 mb-5">
            <p className="text-sm font-bold text-secondary mb-3">Your Pets</p>
            <div className="space-y-3">
              {quoteGroup.quotes.map((quote: any, idx: number) => (
                <div key={idx} className="flex items-center gap-3">
                  <Image
                    src={quote.pet.photoUrl || "https://images.unsplash.com/photo-1552053831-71594a27632d?w=48&h=48&fit=crop"}
                    alt={quote.pet.name}
                    width={48}
                    height={48}
                    className="rounded-full object-cover ring-2 ring-primary"
                  />
                  <div>
                    <p className="font-semibold text-secondary text-sm">{quote.pet.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {quote.pet.primaryBreed}
                    </p>
                  </div>
                  <span className="ml-auto text-sm font-medium text-slate-700">
                    ${quote.pet.petCharge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment summary */}
        <div className="mb-5">
          <h3 className="text-sm font-bold text-secondary mb-3">
            Payment Summary
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Monthly Premium</span>
              <span className="font-medium text-slate-700">${monthlyPremium.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Initial Setup Fee</span>
              <span className="font-medium text-slate-700">${setupFee.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100">
            <span className="text-sm font-bold text-slate-700">Due Today</span>
            <span className="text-2xl font-bold text-slate-800">${setupFee.toFixed(2)}</span>
          </div>
        </div>

        {/* Info note */}
        <div className="bg-primary/20 rounded-lg px-4 py-3 flex items-start gap-2 mb-5">
          <span className="text-primary mt-0.5 shrink-0">ℹ</span>
          <p className="text-xs text-primary">
            By accepting, you agree to pay the initial setup fee today. Your
            monthly premium of <strong>${monthlyPremium.toFixed(2)}</strong> will start 14 days after
            activation.
          </p>
        </div>

        <Button 
          onClick={handleAccept}
          disabled={isReviewing}
          className="w-full bg-primary hover:bg-primary/90 cursor-pointer text-white font-semibold mb-3"
        >
          {isReviewing && (
            <span className="mr-2 inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          )}
          Accept
        </Button>
        <Button
          variant="ghost"
          onClick={() => setShowConfirmDecline(true)}
          disabled={isReviewing}
          className="cursor-pointer w-full text-red-500 hover:text-red-600 hover:bg-red-50 font-medium"
        >
          Decline Quote
        </Button>
      </div>

      {/* Confirm Decline Modal */}
      <Dialog open={showConfirmDecline} onOpenChange={setShowConfirmDecline}>
        <DialogContent className="max-w-sm rounded-2xl p-0 overflow-hidden">
          <div className="p-6">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
                <Shield size={26} className="text-slate-500" />
              </div>
            </div>
            <DialogHeader className="text-center mb-4">
              <DialogTitle className="text-lg font-bold text-slate-800 text-center">
                Are you sure?
              </DialogTitle>
            </DialogHeader>
            <p className="text-sm text-slate-500 text-center mb-5 leading-relaxed">
              If you decline this quote, <strong>{petCount === 1 ? pet.name : `these ${petCount} pets`}</strong> will lose {petCount === 1 ? "their" : "their"} tailored coverage plan. You can always start over, but premium
              rates may change.
            </p>

            <p className="text-xs font-semibold text-slate-600 mb-3">
              Reason for declining (optional)
            </p>
            <RadioGroup
              value={declineReason}
              onValueChange={setDeclineReason}
              className="space-y-2 mb-4"
            >
              {declineReasons.map(({ id, label }) => (
                <div
                  key={id}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer"
                >
                  <RadioGroupItem
                    value={id}
                    id={id}
                    className="text-slate-600"
                  />
                  <Label
                    htmlFor={id}
                    className="text-sm text-slate-700 cursor-pointer"
                  >
                    {label}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <Textarea
              placeholder="Please share more details (optional)"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              className="text-sm border-slate-200 resize-none h-20 mb-4"
            />

            <Button
              className="w-full bg-slate-700 hover:bg-slate-800 text-white font-semibold mb-2"
              onClick={() => setShowConfirmDecline(false)}
            >
              Keep My Quote
            </Button>
            <Button
              variant="ghost"
              className="w-full text-slate-500 hover:text-slate-700 font-medium"
              disabled={isReviewing}
              onClick={handleDecline}
            >
              {isReviewing && (
                <span className="mr-2 inline-block w-4 h-4 border-2 border-slate-500 border-t-slate-700 rounded-full animate-spin" />
              )}
              Decline Quote
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quote Declined Success Modal */}
      <Dialog open={showDeclinedSuccess} onOpenChange={setShowDeclinedSuccess}>
        <DialogContent className="max-w-sm rounded-2xl p-0 overflow-hidden">
          <div className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 size={28} className="text-emerald-500" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              Quote declined
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              We&apos;ve updated your preference. You can request a new quote at
              any time.
            </p>
            <Button
              className="w-full bg-slate-700 hover:bg-slate-800 text-white font-semibold"
              onClick={() => {
                setShowDeclinedSuccess(false);
                router.push("/dashboard");
              }}
            >
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
