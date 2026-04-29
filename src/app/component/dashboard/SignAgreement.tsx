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
    router.push("/quote/payment");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) setSignatureFile(file);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-10 px-4">
      <div className="mb-6 text-xl font-bold tracking-tight text-slate-800 flex items-center gap-1">
        <span>enc</span><span>🐾</span><span>re</span><span>🐶</span>
      </div>

      <StepIndicator currentStep={2} />

      <div className="bg-white rounded-2xl border border-slate-200 p-6 w-full max-w-lg shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-1">Sign Agreement</h2>
        <p className="text-sm text-slate-400 mb-6">
          Please carefully review the policy documents and sign below to proceed with Bella&apos;s coverage.
        </p>

        {/* Agreement doc */}
        <div className="border border-slate-200 rounded-xl p-4 mb-6">
          <h3 className="text-sm font-bold text-slate-700 mb-3">Agreement Document</h3>
          <p className="text-xs text-slate-400 mb-3">
            Open the policy paperwork in a separate viewer before signing.
          </p>
          <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                <FileText size={16} className="text-red-500" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-700">
                  Pet Insurance Terms &amp; Conditions
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Review the complete agreement paperwork before uploading your signature and continuing to payment.
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-xs text-slate-500 gap-1.5 flex-shrink-0 ml-2">
              <ExternalLink size={12} />
              View Agreement
            </Button>
          </div>
        </div>

        {/* Electronic signature */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-700 mb-3">Electronic Signature</h3>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="agreed"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="mt-0.5 border-slate-400 data-[state=checked]:bg-slate-700 data-[state=checked]:border-slate-700"
                        />
                      </FormControl>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        I acknowledge that I have read, understood, and agree to the Encore LLC Terms and
                        Conditions, including the specific coverage limits and pre-existing condition exclusions.
                      </p>
                    </div>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Signature upload */}
              <div>
                <p className="text-xs font-medium text-slate-600 mb-2">
                  Upload Signature Image
                </p>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                    dragOver ? "border-slate-400 bg-slate-100" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                  onClick={() => document.getElementById("sig-input")?.click()}
                >
                  <Upload size={20} className="text-slate-400 mb-2" />
                  <p className="text-sm font-medium text-slate-600">
                    {signatureFile ? signatureFile.name : "Drop signature file here"}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">PNG, JPG, or transparent signature image</p>
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
                <p className="text-xs text-slate-400 mt-2">
                  Use a clear image of your handwritten signature to complete the agreement.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="border-slate-200 text-slate-600"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-slate-700 hover:bg-slate-800 text-white font-semibold"
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
