"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { FileText, ExternalLink, Upload } from "lucide-react";
import StepIndicator from "./StepIndicator";
import PaymentHeader from "./PamentHeader";

const agreementSchema = z.object({
  agreed: z.boolean().refine((v) => v === true, {
    message: "You must agree to the terms and conditions",
  }),
});

type AgreementFormValues = z.infer<typeof agreementSchema>;

export default function SignAgreement() {
  const router = useRouter();
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const form = useForm<AgreementFormValues>({
    resolver: zodResolver(agreementSchema),
    defaultValues: { agreed: false },
  });

  const onSubmit = (_: AgreementFormValues) => {
    router.push("/dashboard/quote/payment");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) setSignatureFile(file);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center px-4">
      <PaymentHeader/>

      <StepIndicator currentStep={2} />

      <div className="bg-white rounded-2xl border border-primary/40 p-6 w-full max-w-4xl shadow-sm">
        <h2 className="text-2xl font-bold text-secondary mb-1">Sign Agreement</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Please carefully review the policy documents and sign below to proceed with Bella&apos;s coverage.
        </p>

        {/* Agreement doc */}
        <div className="border border-slate-200 rounded-xl p-4 mb-6">
          <h3 className="text-sm font-bold text-secondary mb-3">Agreement Document</h3>
          <p className="text-xs text-muted-foreground mb-3">
            Open the policy paperwork in a separate viewer before signing.
          </p>
          <div className="flex items-center justify-between p-3 rounded-lg border border-muted-foreground/20 bg-primary/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded bg-white border border-primary/40 flex items-center justify-center shrink-0">
                <FileText size={24} className="text-primary" />
              </div>
              <div>
                <p className="text-xs font-semibold text-secondary">
                  Pet Insurance Terms &amp; Conditions
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Review the complete agreement paperwork before uploading your signature and continuing to payment.
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-xs border border-primary/20 bg-white p-4 rounded text-secondary gap-1.5 shrink-0 ml-2 cursor-pointer">
              <ExternalLink size={12} />
              View Agreement
            </Button>
          </div>
        </div>

        {/* Electronic signature */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-secondary mb-3">Electronic Signature</h3>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="agreed"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-start gap-3 p-3 rounded-lg border border-primary/20 bg-primary/10">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="mt-0.5 border-slate-400 data-[state=checked]:bg-slate-700 data-[state=checked]:border-slate-700"
                        />
                      </FormControl>
                      <p className="text-sm text-secondary">
                        I acknowledge that I have read, understood, and agree to the Encore LLC Terms and
                        Conditions, <br /> including the specific coverage limits and pre-existing condition exclusions.
                      </p>
                    </div>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Signature upload */}
              <div>
                <p className="text-xs font-medium text-secondary mb-2">
                  Upload Signature Image
                </p>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed border-primary/60 bg-primary/10 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                    dragOver ? "border-primary/40 bg-primary/20" : "border-muted-foreground/20 hover:border-muted-foreground/40 hover:bg-muted-foreground/10"
                  }`}
                  onClick={() => document.getElementById("sig-input")?.click()}
                >
                  <Upload size={20} className="text-slate-400 mb-2" />
                  <p className="text-sm font-medium text-slate-600">
                    {signatureFile ? signatureFile.name : "Drop signature file here"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG, or transparent signature image</p>
                  <input
                    id="sig-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setSignatureFile(file);
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Use a clear image of your handwritten signature to complete the agreement.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="border-slate-200 text-secondary cursor-pointer hover:bg-primary/10 rounded"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 rounded cursor-pointer text-white font-semibold"
                >
                  Agree &amp; Continue to Payment
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
