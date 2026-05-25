"use client";

import { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useGetMyQuotesQuery } from "@/redux/api/onboardingApi";
import { useSignAgreementMutation, useGetMyAgreementsQuery } from "@/redux/api/agreementApi";
import { toast } from "sonner";
import { Download, ExternalLink, Loader2, Upload, X } from "lucide-react";
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
  const searchParams = useSearchParams();
  const selectedQuoteGroupId = searchParams.get("quoteGroupId");
  const [agreementFile, setAgreementFile] = useState<File | null>(null);
  const [dragOverDoc, setDragOverDoc] = useState(false);
  const { data: myAgreements, isLoading: isLoadingAgreements } = useGetMyAgreementsQuery();
  const { data: quotesData, isLoading: isLoadingQuotes } = useGetMyQuotesQuery(undefined);
  const isPageLoading = isLoadingAgreements || isLoadingQuotes;

  const isSigned = (quoteGroup: any) => myAgreements?.data?.some((a: any) =>
    (a.quoteId === quoteGroup?.quoteGroupId || quoteGroup?.quotes?.some((pq: any) => pq.id === a.quoteId)) && a.isSigned === true
  );

  const selectedQuoteGroup = useMemo(() => {
    return quotesData?.data?.find((group: any) => group.quoteGroupId === selectedQuoteGroupId && group.isAccepted)
      || quotesData?.data?.find((group: any) => group.isAccepted && !isSigned(group))
      || quotesData?.data?.find((group: any) => group.isAccepted)
      || quotesData?.data?.[0];
  }, [quotesData, selectedQuoteGroupId, myAgreements]);

  const selectedAgreementDocuments = useMemo(() => {
    const docs = (selectedQuoteGroup?.quotes || [])
      .map((quote: any) => {
        if (!quote.agrementUrl) return null;
        return {
          id: `quote-agreement-${quote.id}`,
          agreementDocURL: quote.agrementUrl,
          title: quote.pet?.name ? `${quote.pet.name} Agreement` : "Pet Insurance Agreement",
        };
      })
      .filter(Boolean);

    return docs;
  }, [selectedQuoteGroup]);
  const firstSelectedDoc = selectedAgreementDocuments[0] || null;
  const isLoadingDocs = quotesData === undefined;

  // Auto-redirect if already signed
  useEffect(() => {
    if (myAgreements?.data && myAgreements.data.length > 0 && quotesData?.data) {
      const activeQuoteGroup = selectedQuoteGroup;
      const hasSignedThisQuote = myAgreements.data.some((a: any) =>
        (a.quoteId === activeQuoteGroup?.quoteGroupId ||
          activeQuoteGroup?.quotes?.some((pq: any) => pq.id === a.quoteId)) && a.isSigned === true
      );

      if (hasSignedThisQuote) {
        router.push(`/dashboard/quote/payment?quoteGroupId=${activeQuoteGroup?.quoteGroupId}`);
      }
    }
  }, [myAgreements, quotesData, router, selectedQuoteGroup]);

  const form = useForm<AgreementFormValues>({
    resolver: zodResolver(agreementSchema),
    defaultValues: { agreed: false },
  });

  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();
  const [signAgreement, { isLoading: isSigning }] = useSignAgreementMutation();

  const onSubmit = async (_: AgreementFormValues) => {
    const quoteId = selectedQuoteGroup?.quotes?.[0]?.id;
    let documentUrl: string | undefined = undefined;
    try {
      if (!selectedQuoteGroup?.isAccepted) {
        toast.error("Please accept a quote before signing the agreement");
        return;
      }

      if (!agreementFile) {
        toast.error("Please upload an agreement document to continue");
        return;
      }

      toast.info("Uploading agreement document...");
      const docFormData = new FormData();
      docFormData.append("files", agreementFile);
      const docResponse = await uploadFile(docFormData).unwrap();
      documentUrl = docResponse.url || (docResponse as any)?.data?.urls?.[0];

      if (!documentUrl) {
        toast.error("Failed to upload the agreement document");
        return;
      }

      const signatureDocUrl = documentUrl;

      // 2. Sign agreement
      await signAgreement({
        quoteId,
        documentUrl,
        signatureDocUrl,
        ipAddress: "127.0.0.1",
      }).unwrap();

      toast.success("Agreement signed successfully!");
      router.push(`/dashboard/quote/payment?quoteGroupId=${selectedQuoteGroup?.quoteGroupId || quoteId}`);
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

  const handleDownloadDocument = async (url: string, fileName: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to download document");

      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(objectUrl);
    } catch {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const getPreviewUrl = (url: string) => {
    if (url.includes('/view') || url.includes('/preview')) {
      return url.replace('/view', '/edit').replace('/preview', '/edit');
    }
    if (url.includes('/d/')) {
      const docId = url.match(/\/d\/([a-zA-Z0-9_-]+)/)?.[1];
      if (docId) {
        return `https://docs.google.com/document/d/${docId}/edit`;
      }
    }
    return url;
  };

  if (isPageLoading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50 h-dvh w-screen">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-slate-500 font-medium animate-pulse">Loading agreement details...</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <div className="fixed inset-0 z-50 h-dvh w-screen overflow-hidden bg-slate-50">
        <div className="flex h-full flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex items-center gap-4">
              <PaymentHeader />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex justify-center px-4 pt-4 sm:px-6">
            <StepIndicator currentStep={2} />
          </div>

          <div className="flex-1 overflow-hidden px-4 py-4 sm:px-6 sm:py-6">
            <div className="grid h-full grid-cols-1 gap-4 lg:grid-cols-[1.35fr_0.85fr]">
              <div className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                  <div>
                    <h2 className="text-xl font-bold text-secondary">Review Agreement</h2>
                    <p className="text-sm text-muted-foreground">
                      Read the full document before signing.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 text-secondary"
                      onClick={() => {
                        const firstDoc = firstSelectedDoc?.agreementDocURL;
                        if (firstDoc) window.open(firstDoc, "_blank", "noopener,noreferrer");
                      }}
                    >
                      <ExternalLink size={14} />
                      Open in new tab
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 text-secondary"
                      onClick={() => {
                        const firstDoc = firstSelectedDoc?.agreementDocURL;
                        if (firstDoc) {
                          handleDownloadDocument(firstDoc, `${firstSelectedDoc?.title || "agreement"}.pdf`);
                        }
                      }}
                    >
                      <Download size={14} />
                      Download doc
                    </Button>
                  </div>
                </div>

                <div className="min-h-0 flex-1 overflow-auto bg-slate-50 p-4">
                  {isLoadingDocs ? (
                    <div className="flex h-full min-h-105 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white">
                      <p className="text-sm text-muted-foreground animate-pulse">Loading agreement documents...</p>
                    </div>
                  ) : selectedAgreementDocuments.length > 0 ? (
                    <div className="space-y-4">
                      {selectedAgreementDocuments.map((doc: any) => {
                        const previewUrl = doc.agreementDocURL ? getPreviewUrl(doc.agreementDocURL) : "";

                        return (
                          <div key={doc.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white">

                            <div className="h-[70vh] min-h-105 bg-slate-100">
                              {previewUrl ? (
                                <iframe
                                  title={doc.title || "Agreement Document"}
                                  src={previewUrl}
                                  className="h-full w-full"
                                  allow="fullscreen"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center p-6 text-sm text-muted-foreground">
                                  Document URL not available.
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex h-full min-h-105 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white">
                      <p className="text-sm text-muted-foreground">No agreement documents found for the accepted quote.</p>
                    </div>
                  )}

                </div>
              </div>

              <div className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-primary/30 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-5 py-4">
                  <h3 className="text-lg font-bold text-secondary">Sign in the modal</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload a document, review the terms, and confirm the agreement to continue.
                  </p>
                </div>

                <form onSubmit={form.handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col">
                  <div className="min-h-0 flex-1 space-y-5 overflow-auto p-5">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">Upload agreement document</p>
                      <div
                        onDragOver={(e) => { e.preventDefault(); setDragOverDoc(true); }}
                        onDragLeave={() => setDragOverDoc(false)}
                        onDrop={handleDropDoc}
                        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${dragOverDoc ? "border-primary bg-primary/10" : "border-slate-200 hover:border-primary/40 hover:bg-slate-50"
                          }`}
                        onClick={() => document.getElementById("doc-input")?.click()}
                      >
                        <Upload size={18} className="mb-2 text-slate-400" />
                        <p className="text-xs font-medium text-slate-600">
                          {agreementFile ? agreementFile.name : "Drop agreement PDF/DOC here"}
                        </p>
                        <p className="mt-1 text-[11px] text-slate-400">
                          Or click anywhere in this box to choose a file.
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
                      <p className="mt-2 text-xs text-slate-500">
                        You must upload a document before you can agree and continue.
                      </p>
                    </div>

                    <FormField
                      control={form.control}
                      name="agreed"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/10 p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="mt-0.5 border-slate-400 data-[state=checked]:border-slate-700 data-[state=checked]:bg-slate-700"
                              />
                            </FormControl>
                            <p className="text-sm text-secondary">
                              I acknowledge that I have read, understood, and agree to the Encore LLC Terms and Conditions,
                              including the specific coverage limits and pre-existing condition exclusions.
                            </p>
                          </div>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="border-t border-slate-200 bg-white px-5 py-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/dashboard")}
                        className="border-slate-200 text-secondary hover:bg-primary/10 rounded"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isPending}
                        className="min-w-55 rounded bg-primary text-white hover:bg-primary/90"
                      >
                        {isPending ? (
                          <>
                            <Loader2 size={16} className="mr-2 animate-spin" />
                            {isUploading ? "Uploading Document..." : "Processing Agreement..."}
                          </>
                        ) : (
                          "Agree & Continue to Payment"
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
}
