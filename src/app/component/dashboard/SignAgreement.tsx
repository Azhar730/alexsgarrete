"use client";

import { useState, useMemo } from "react";
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
import { useGetAgreementDocumentsQuery, useGetMyQuotesQuery } from "@/redux/api/onboardingApi";
import { useSignAgreementMutation, useGetMyAgreementsQuery } from "@/redux/api/agreementApi";
import { toast } from "sonner";
import { ExternalLink, FileText, Loader2, Upload } from "lucide-react";
import { useEffect } from "react";
import PaymentHeader from "./PamentHeader";
import StepIndicator from "./StepIndicator";
import { useUploadFileMutation } from "@/redux/api/storageApi";

const agreementSchema = z.object({
  agreed: z.boolean().refine((v) => v === true, {
    message: "You must agree to the terms and conditions",
  }),
});

type AgreementFormValues = z.infer<typeof agreementSchema>;

export default function SignAgreement() {
  const router = useRouter();
  const [agreementFile, setAgreementFile] = useState<File | null>(null);
  const [dragOverDoc, setDragOverDoc] = useState(false);
  const { data: agreements, isLoading } = useGetAgreementDocumentsQuery(undefined);
  const { data: myAgreements } = useGetMyAgreementsQuery();
  const { data: quotesData } = useGetMyQuotesQuery(undefined);
  // Helper: check if a string is a valid URL
  const isValidUrl = (url: string) => {
    try { new URL(url); return true; } catch { return false; }
  };

  // Build list of available agreement documents (scan ALL quote groups for valid URLs)
  const allDocs = useMemo(() => {
    const docs = [...(agreements?.data || [])];
    const allGroups: any[] = quotesData?.data || [];

    // Prioritize accepted group, then fall back to any group with a valid URL
    const orderedGroups = [
      ...allGroups.filter((g: any) => g.isAccepted),
      ...allGroups.filter((g: any) => !g.isAccepted),
    ];

    for (const group of orderedGroups) {
      for (const quote of group.quotes || []) {
        const url = quote.agrementUrl;
        if (url && isValidUrl(url)) {
          const alreadyExists = docs.some((d: any) => d.agreementDocURL === url);
          if (!alreadyExists) {
            docs.push({
              id: `quote-agreement-${quote.id}`,
              agreementDocURL: url,
              title: "Pet Insurance Agreement"
            });
          }
        }
      }
    }
    return docs;
  }, [agreements, quotesData]);

  // Auto-redirect if already signed
  useEffect(() => {
    if (myAgreements?.data && myAgreements.data.length > 0 && quotesData?.data) {
      const activeQuoteGroup = quotesData.data.find((q: any) => q.isAccepted) || quotesData.data[0];
      const hasSignedThisQuote = myAgreements.data.some((a: any) => 
        (a.quoteId === activeQuoteGroup?.quoteGroupId || 
        activeQuoteGroup?.quotes?.some((pq: any) => pq.id === a.quoteId)) && a.isSigned === true
      );
      
      if (hasSignedThisQuote) {
        router.push("/dashboard/quote/payment");
      }
    }
  }, [myAgreements, quotesData, router]);

  const form = useForm<AgreementFormValues>({
    resolver: zodResolver(agreementSchema),
    defaultValues: { agreed: false },
  });

  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();
  const [signAgreement, { isLoading: isSigning }] = useSignAgreementMutation();

  const onSubmit = async (_: AgreementFormValues) => {
    const allGroups: any[] = quotesData?.data || [];
    const activeQuoteGroup = allGroups.find((q: any) => q.isAccepted) || allGroups[0];
    const quoteId = activeQuoteGroup?.quotes?.[0]?.id;

    // Find the first valid URL across accepted group first, then any group
    const orderedGroups = [
      ...allGroups.filter((g: any) => g.isAccepted),
      ...allGroups.filter((g: any) => !g.isAccepted),
    ];
    let documentUrl: string | undefined = undefined;
    for (const group of orderedGroups) {
      for (const quote of group.quotes || []) {
        if (quote.agrementUrl && isValidUrl(quote.agrementUrl)) {
          documentUrl = quote.agrementUrl;
          break;
        }
      }
      if (documentUrl) break;
    }
    // Fallback to general agreement docs from DB
    if (!documentUrl) documentUrl = agreements?.data?.[0]?.agreementDocURL;

    try {
      // 1. Upload Agreement Document if manually provided
      if (agreementFile) {
        toast.info("Uploading agreement document...");
        const docFormData = new FormData();
        docFormData.append("files", agreementFile);
        const docResponse = await uploadFile(docFormData).unwrap();
        documentUrl = docResponse.url || (docResponse as any)?.data?.urls?.[0];
      }

      if (!documentUrl) {
        toast.error("Please upload an agreement document or select an existing one");
        return;
      }

      // 2. Sign agreement
      await signAgreement({
        quoteId,
        documentUrl,
        ipAddress: "127.0.0.1",
      }).unwrap();

      toast.success("Agreement signed successfully!");
      router.push("/dashboard/quote/payment");
    } catch (error: any) {
      console.error("Signing error:", error);
      toast.error(error?.data?.message || "Failed to sign agreement. Please try again.");
    }
  };

  const isPending = isUploading || isSigning;


  const handleDropDoc = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverDoc(false);
    const file = e.dataTransfer.files[0];
    if (file) setAgreementFile(file);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center px-4">
      <PaymentHeader/>

      <StepIndicator currentStep={2} />

      <div className="bg-white rounded-2xl border border-primary/40 p-6 w-full max-w-4xl shadow-sm">
        <h2 className="text-2xl font-bold text-secondary mb-1">Review Agreement</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Please carefully review the policy documents and acknowledge them below to proceed with your pet's coverage.
        </p>

        {/* Agreement doc */}
        <div className="space-y-4 mb-6">
          {isLoading ? (
            <div className="flex items-center justify-center p-8 border border-slate-200 rounded-xl bg-slate-50">
              <p className="text-sm text-muted-foreground animate-pulse">Loading agreement documents...</p>
            </div>
          ) : allDocs.length > 0 ? (
            allDocs.map((doc: any) => (
              <div key={doc.id} className="border border-slate-200 rounded-xl p-4">
                <h3 className="text-sm font-bold text-secondary mb-3">{doc.title || "Agreement Document"}</h3>
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
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs border border-primary/20 bg-white p-4 rounded text-secondary gap-1.5 shrink-0 ml-2 cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => doc.agreementDocURL && window.open(doc.agreementDocURL, "_blank")}
                  >
                    <ExternalLink size={12} />
                    View Agreement
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="border border-slate-200 rounded-xl p-6 text-center bg-slate-50">
              <p className="text-sm text-muted-foreground">No agreement documents found at this time.</p>
            </div>
          )}
          
          {/* New Manual Document Upload */}
          <div className="mt-4">
            <p className="text-xs font-medium text-secondary mb-2">
              OR Upload Agreement Document Manually
            </p>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOverDoc(true); }}
              onDragLeave={() => setDragOverDoc(false)}
              onDrop={handleDropDoc}
              className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                dragOverDoc ? "border-primary bg-primary/10" : "border-slate-200 hover:border-primary/40 hover:bg-slate-50"
              }`}
              onClick={() => document.getElementById("doc-input")?.click()}
            >
              <Upload size={18} className="text-slate-400 mb-2" />
              <p className="text-xs font-medium text-slate-600">
                {agreementFile ? agreementFile.name : "Drop agreement PDF/DOC here"}
              </p>
              <input
                id="doc-input"
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setAgreementFile(file);
                }}
              />
            </div>
          </div>
        </div>

        {/* Electronic signature */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-secondary mb-3">Acknowledgment</h3>

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
                  disabled={isPending}
                  className="bg-primary hover:bg-primary/90 rounded cursor-pointer text-white font-semibold min-w-[200px]"
                >
                  {isPending ? (
                    <>
                      <Loader2 size={16} className="animate-spin mr-2" />
                      {isUploading ? "Uploading Document..." : "Processing Agreement..."}
                    </>
                  ) : (
                    "Agree & Continue to Payment"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
