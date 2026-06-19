"use client";

import { useState } from "react";
import { useStripe, useElements, PaymentElement, LinkAuthenticationElement, AddressElement } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CustomCheckoutFormProps {
  amount: number;
  userEmail?: string;
  userName?: string;
}

export default function CustomCheckoutForm({ amount, userEmail, userName }: CustomCheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    let result: any;
    const rawResult: any = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    const error = rawResult.error;
    const paymentIntent = rawResult.paymentIntent;
    const setupIntent = rawResult.setupIntent;

    if (error) {
      toast.error(error.message || "An unexpected error occurred.");
      setIsLoading(false);
    } else if (paymentIntent?.status === "succeeded" || setupIntent?.status === "succeeded") {
      toast.success("Payment successful! Redirecting...");
      router.push(`/payment/success`);
    } else {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mt-4">
      <div className="mb-6">
        <h3 className="mb-3 text-sm font-semibold text-slate-700">Contact information</h3>
        <LinkAuthenticationElement 
          options={{ defaultValues: { email: userEmail || "" } }} 
        />
      </div>

      <div className="mb-6">
        <h3 className="mb-3 text-sm font-semibold text-slate-700">Payment method</h3>
        <PaymentElement options={{ layout: "accordion", defaultValues: { billingDetails: { name: userName || "" } } }} />
      </div>

      <div className="mb-6">
        <h3 className="mb-3 text-sm font-semibold text-slate-700">Billing address</h3>
        <AddressElement options={{ mode: "billing", defaultValues: { name: userName || "" } }} />
      </div>
      
      <Button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full bg-[#5C7FC4] hover:bg-[#4A6BAF] active:bg-[#3D5A9C] text-white font-semibold py-6 text-lg rounded-xl shadow-md transition-all mt-4"
      >
        {isLoading ? (
          <>
            <Loader2 size={20} className="animate-spin mr-2" />
            Processing...
          </>
        ) : (
          "Pay and start coverage"
        )}
      </Button>

      <div className="flex items-center justify-center gap-1.5 mt-4 text-slate-400">
        <Lock size={12} />
        <span className="text-xs">
          Secure Encrypted Checkout via Stripe
        </span>
      </div>
    </form>
  );
}
