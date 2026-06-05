"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";

const dataURLtoFile = (dataurl: string, filename: string): File => {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

const cropSignatureCanvas = (canvas: HTMLCanvasElement): HTMLCanvasElement => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const w = canvas.width;
  const h = canvas.height;
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  let minX = w, maxX = 0, minY = h, maxY = 0;
  let found = false;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const a = data[idx + 3];

      const isWhite = r > 240 && g > 240 && b > 240;
      if (a > 0 && !isWhite) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
        found = true;
      }
    }
  }

  if (!found) return canvas;

  const padding = 12;
  minX = Math.max(0, minX - padding);
  minY = Math.max(0, minY - padding);
  maxX = Math.min(w - 1, maxX + padding);
  maxY = Math.min(h - 1, maxY + padding);

  const cropWidth = maxX - minX + 1;
  const cropHeight = maxY - minY + 1;

  const cropCanvas = document.createElement("canvas");
  cropCanvas.width = cropWidth;
  cropCanvas.height = cropHeight;
  const cropCtx = cropCanvas.getContext("2d");
  if (!cropCtx) return canvas;

  cropCtx.fillStyle = "#ffffff";
  cropCtx.fillRect(0, 0, cropWidth, cropHeight);
  cropCtx.drawImage(canvas, minX, minY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

  return cropCanvas;
};
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
import { useGetMyQuotesQuery, useGetMyApplicationsQuery, useGetFamilyHealthHistoryByApplicationQuery } from "@/redux/api/onboardingApi";
import { useSignAgreementMutation, useGetMyAgreementsQuery } from "@/redux/api/agreementApi";
import { useGetMeQuery, useGetAllUserQuery } from "@/redux/api/userApi";
import { AgreementTemplate } from "./AgreementTemplate";
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
  const [signatureMode, setSignatureMode] = useState<"draw" | "type">("draw");
  const [hasSigned, setHasSigned] = useState(false);
  const [typedName, setTypedName] = useState("");
  const [drawnSignatureUrl, setDrawnSignatureUrl] = useState<string | null>(null);
  const [canvasWidth, setCanvasWidth] = useState(400);
  const [canvasHeight, setCanvasHeight] = useState(220);
  const sigCanvasRef = useRef<any>(null);
  const sigCanvasWrapperRef = useRef<HTMLDivElement>(null);
  const { data: myAgreements, isLoading: isLoadingAgreements } = useGetMyAgreementsQuery();
  const { data: quotesData, isLoading: isLoadingQuotes } = useGetMyQuotesQuery(undefined);
  const { data: myApplications, isLoading: isLoadingApplications } = useGetMyApplicationsQuery(undefined);
  const { data: userData, isLoading: isLoadingUser } = useGetMeQuery({});
  const isPageLoading = isLoadingAgreements || isLoadingQuotes || isLoadingApplications || isLoadingUser;
  const activeApplication = myApplications?.data?.[0];
  
  const { data: allUsersResponse } = useGetAllUserQuery(undefined);

  const { data: familyHistoryResponse } = useGetFamilyHealthHistoryByApplicationQuery(
    activeApplication?.id ?? "",
    { skip: !activeApplication?.id }
  );

  const familyHealthHistories = useMemo(() => {
    if (activeApplication?.familyHealthHistories && activeApplication.familyHealthHistories.length > 0) {
      return activeApplication.familyHealthHistories;
    }
    const data = familyHistoryResponse?.data || familyHistoryResponse;
    return Array.isArray(data) ? data : data ? [data] : [];
  }, [activeApplication, familyHistoryResponse]);

  const healthAnswers = useMemo(() => {
    if (activeApplication?.healthAnswers && activeApplication.healthAnswers.length > 0) {
      return activeApplication.healthAnswers;
    }
    
    // Fallback: extract from questionnaire questions
    const questions = activeApplication?.questionnaire?.questions || [];
    const extracted: any[] = [];
    questions.forEach((q: any) => {
      if (q.answers && q.answers.length > 0) {
        q.answers.forEach((ans: any) => {
          extracted.push({
            ...ans,
            questionId: q.id,
            question: {
              id: q.id,
              questionText: q.questionText,
              category: q.category
            }
          });
        });
      }
    });
    return extracted;
  }, [activeApplication]);

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
        const url = quote.agrementUrl || quote.agreementUrl || null;
        if (!url) return null;
        return {
          id: `quote-agreement-${quote.id}`,
          agreementDocURL: url,
          title: quote.pet?.name ? `${quote.pet.name} Agreement` : "Pet Insurance Agreement",
        };
      })
      .filter(Boolean) as any[];

    // Deduplicate documents by agreementDocURL to avoid rendering the same doc multiple times
    const seen = new Set<string>();
    const uniqueDocs: any[] = [];
    for (const d of docs) {
      if (!d || !d.agreementDocURL) continue;
      if (seen.has(d.agreementDocURL)) continue;
      seen.add(d.agreementDocURL);
      uniqueDocs.push(d);
    }

    return uniqueDocs;
  }, [selectedQuoteGroup]);
  const showAutoGeneratedTemplate = useMemo(() => {
    if (selectedAgreementDocuments.length === 0) return true;
    const firstDoc = selectedAgreementDocuments[0];
    return !firstDoc?.agreementDocURL || firstDoc.agreementDocURL.startsWith("AUTO_GENERATED");
  }, [selectedAgreementDocuments]);
  const firstSelectedDoc = selectedAgreementDocuments[0] || null;
  const agreementUrl = firstSelectedDoc?.agreementDocURL || "";
  const queryParams = useMemo(() => {
    return new URLSearchParams(agreementUrl.includes("?") ? agreementUrl.split("?")[1] : "");
  }, [agreementUrl]);
  const transportFee = Number(queryParams.get("transportFee") || 50);
  const spayNeuterFee = Number(queryParams.get("spayNeuterFee") || 150);
  const dueDay = Number(queryParams.get("dueDay") || 1);
  const lateFee = Number(queryParams.get("lateFee") || 25);
  const representativeSignatureUrl = queryParams.get("representativeSignatureUrl") || null;
  const queryAdminName = queryParams.get("adminName") || null;
  const adminName = useMemo(() => {
    if (queryAdminName) return queryAdminName;
    if (!allUsersResponse?.data) return "";
    const admin = allUsersResponse.data.find((u: any) => u.role === "ADMIN");
    return admin?.fullName || "";
  }, [allUsersResponse, queryAdminName]);
  const isLoadingDocs = quotesData === undefined;

  const currentAgreement = useMemo(() => {
    if (!myAgreements?.data || !selectedQuoteGroup) return null;
    const activeQuoteGroup = selectedQuoteGroup;
    return myAgreements.data.find((a: any) =>
      a.quoteId === activeQuoteGroup?.quoteGroupId ||
      activeQuoteGroup?.quotes?.some((pq: any) => pq.id === a.quoteId)
    );
  }, [myAgreements, selectedQuoteGroup]);

  const isAlreadySigned = !!(currentAgreement && (currentAgreement.isSigned || currentAgreement.signatureDocUrl));

  useEffect(() => {
    if (signatureMode === "draw") {
      const updateDimensions = () => {
        if (sigCanvasWrapperRef.current) {
          const rect = sigCanvasWrapperRef.current.getBoundingClientRect();
          setCanvasWidth(rect.width || 400);
          setCanvasHeight(rect.height || 220);
        }
      };
      
      const timer = setTimeout(updateDimensions, 150);
      window.addEventListener("resize", updateDimensions);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("resize", updateDimensions);
      };
    }
  }, [signatureMode]);

  const isDrawingRef = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  const getPos = (e: any, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const clientX = e.clientX ?? (e.touches?.[0]?.clientX ?? e.changedTouches?.[0]?.clientX ?? 0);
    const clientY = e.clientY ?? (e.touches?.[0]?.clientY ?? e.changedTouches?.[0]?.clientY ?? 0);
    
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const startDraw = useCallback((e: any) => {
    if (e.cancelable) {
      e.preventDefault();
    }
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    isDrawingRef.current = true;
    setHasSigned(true);
    lastPos.current = getPos(e, canvas);
  }, []);

  const draw = useCallback((e: any) => {
    if (!isDrawingRef.current) return;
    if (e.cancelable) {
      e.preventDefault();
    }
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e, canvas);
    if (lastPos.current) {
      ctx.strokeStyle = "#1e3a8a";
      ctx.lineWidth = 3.0; // Moderate boldness matching admin side
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
    lastPos.current = pos;
  }, []);

  const endDraw = useCallback(() => {
    isDrawingRef.current = false;
    lastPos.current = null;
    const canvas = sigCanvasRef.current;
    if (canvas) {
      const croppedCanvas = cropSignatureCanvas(canvas);
      setDrawnSignatureUrl(croppedCanvas.toDataURL("image/png"));
    }
  }, []);

  const clearCanvas = () => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
    setDrawnSignatureUrl(null);
  };

  // Init canvas with white background
  useEffect(() => {
    if (signatureMode !== "draw") return;
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [signatureMode, canvasWidth, canvasHeight]);

  // Handle touch interactions directly to ensure they are smooth and prevent scrolling
  useEffect(() => {
    if (signatureMode !== "draw") return;
    const canvas = sigCanvasRef.current;
    if (!canvas) return;

    const handleTouchStart = (e: TouchEvent) => {
      startDraw(e);
    };
    const handleTouchMove = (e: TouchEvent) => {
      draw(e);
    };
    const handleTouchEnd = (e: TouchEvent) => {
      endDraw();
    };

    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
    };
  }, [signatureMode, startDraw, draw, endDraw]);

  const form = useForm<AgreementFormValues>({
    resolver: zodResolver(agreementSchema),
    defaultValues: { agreed: false },
  });

  useEffect(() => {
    if (isAlreadySigned) {
      form.setValue("agreed", true);
    }
  }, [isAlreadySigned, form]);

  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();
  const [signAgreement, { isLoading: isSigning }] = useSignAgreementMutation();

  const onSubmit = async (_: AgreementFormValues) => {
    const quoteId = selectedQuoteGroup?.quotes?.[0]?.id;
    if (isAlreadySigned) {
      router.push(`/dashboard/quote/payment?quoteGroupId=${selectedQuoteGroup?.quoteGroupId || quoteId}`);
      return;
    }
    let documentUrl: string | undefined = undefined;
    let signatureDocUrl: string | undefined = undefined;
    try {
      if (!selectedQuoteGroup?.isAccepted) {
        toast.error("Please accept a quote before signing the agreement");
        return;
      }

      if (signatureMode === "draw") {
        if (!hasSigned || !sigCanvasRef.current) {
          toast.error("Please draw your signature before continuing");
          return;
        }

        toast.info("Uploading your signature...");
        const canvas = sigCanvasRef.current;
        const croppedCanvas = cropSignatureCanvas(canvas);
        const signatureDataUrl = croppedCanvas.toDataURL("image/png");
        const signatureFile = dataURLtoFile(signatureDataUrl, "signature.png");

        const sigFormData = new FormData();
        sigFormData.append("files", signatureFile);
        const sigResponse = await uploadFile(sigFormData).unwrap();
        signatureDocUrl = sigResponse.url || (sigResponse as any)?.data?.urls?.[0];

        if (!signatureDocUrl) {
          toast.error("Failed to upload your signature");
          return;
        }

        documentUrl = firstSelectedDoc?.agreementDocURL || "AUTO_GENERATED";
      } else if (signatureMode === "type") {
        if (!typedName.trim()) {
          toast.error("Please type your name before continuing");
          return;
        }

        toast.info("Generating and uploading your signature...");
        const canvas = document.createElement("canvas");
        canvas.width = 500;
        canvas.height = 180;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          toast.error("Failed to generate signature canvas");
          return;
        }
        
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = "#1e3a8a"; // Ink blue
        ctx.font = "italic 44px 'Caveat', 'Pacifico', cursive, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(typedName.trim(), canvas.width / 2, canvas.height / 2 - 10);
        
        // Underline tail decoration
        ctx.strokeStyle = "#94a3b8";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(80, 120);
        ctx.quadraticCurveTo(250, 135, 420, 115);
        ctx.stroke();

        const signatureDataUrl = canvas.toDataURL("image/png");
        const signatureFile = dataURLtoFile(signatureDataUrl, "signature.png");

        const sigFormData = new FormData();
        sigFormData.append("files", signatureFile);
        const sigResponse = await uploadFile(sigFormData).unwrap();
        signatureDocUrl = sigResponse.url || (sigResponse as any)?.data?.urls?.[0];

        if (!signatureDocUrl) {
          toast.error("Failed to upload your signature");
          return;
        }

        documentUrl = firstSelectedDoc?.agreementDocURL || "AUTO_GENERATED";
      } else {
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

        signatureDocUrl = documentUrl;
      }

      // 2. Sign agreement
      await signAgreement({
        quoteId,
        documentUrl: documentUrl!,
        signatureDocUrl: signatureDocUrl!,
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
    // Ensure we return a view-only/preview URL for embedded documents.
    // Convert any Google Docs edit links into preview links so users cannot edit the doc in-place.
    if (url.includes('/edit')) {
      return url.replace('/edit', '/preview');
    }
    if (url.includes('/preview') || url.includes('/view')) {
      return url;
    }
    if (url.includes('/d/')) {
      const docId = url.match(/\/d\/([a-zA-Z0-9_-]+)/)?.[1];
      if (docId) {
        return `https://docs.google.com/document/d/${docId}/preview`;
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
          {/* <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
            {/* <div className="flex items-center gap-4 lg:hidden">
              <PaymentHeader />
            </div> */}
            {/* <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            >
              <X className="h-5 w-5" />
            </Button>
          </div> */} 

          <div className="flex justify-center px-4 pt-4 sm:px-6">
            <StepIndicator currentStep={2} />
          </div>

          <div className="flex-1 overflow-hidden px-4 py-4 sm:px-6 sm:py-6 relative h-full">
            <div className="grid h-full max-h-full grid-cols-1 gap-4 lg:grid-cols-[1.35fr_0.85fr]">
              <div className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm h-full">
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 shrink-0">
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

                <div 
                  className="min-h-0 flex-1 overflow-auto style-scrollbar bg-slate-50 p-4 h-full relative"
                  data-lenis-prevent
                >
                  {isLoadingDocs ? (
                    <div className="flex h-full min-h-105 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white">
                      <p className="text-sm text-muted-foreground animate-pulse">Loading agreement documents...</p>
                    </div>
                  ) : showAutoGeneratedTemplate ? (
                    <AgreementTemplate
                      clientName={
                        activeApplication?.personInfo
                          ? `${activeApplication.personInfo.firstName} ${activeApplication.personInfo.middleInitial ? activeApplication.personInfo.middleInitial + " " : ""}${activeApplication.personInfo.lastName}`
                          : userData?.data?.fullName || ""
                      }
                      clientAddress={
                        activeApplication?.personInfo
                          ? `${activeApplication.personInfo.streetAddress || ""}, ${activeApplication.personInfo.city || ""}, ${activeApplication.personInfo.state || ""} ${activeApplication.personInfo.zipCode || ""}`
                          : ""
                      }
                      clientPhone={
                        activeApplication?.personInfo?.cellPhone ||
                        activeApplication?.personInfo?.homePhone ||
                        activeApplication?.personInfo?.workPhone ||
                        ""
                      }
                      clientEmail={userData?.data?.email || ""}
                      representativeName={activeApplication?.representative?.fullName || ""}
                      representativeEmail={activeApplication?.representative?.email || ""}
                      representativePhone={
                        activeApplication?.representative?.phoneNumber ||
                        activeApplication?.representative?.cellPhone ||
                        activeApplication?.representative?.homePhone ||
                        ""
                      }
                      adminName={adminName}

                      clientFirstName={activeApplication?.personInfo?.firstName || ""}
                      clientLastName={activeApplication?.personInfo?.lastName || ""}
                      clientMiddleInitial={activeApplication?.personInfo?.middleInitial || ""}
                      clientSsnLast4={activeApplication?.personInfo?.ssnLast4 || ""}
                      clientHomePhone={activeApplication?.personInfo?.homePhone || ""}
                      clientWorkPhone={activeApplication?.personInfo?.workPhone || ""}

                      representativeFirstName={activeApplication?.representative?.fullName?.split(" ")[0] || ""}
                      representativeLastName={activeApplication?.representative?.fullName?.split(" ").slice(1).join(" ") || ""}
                      representativeMiddleInitial={activeApplication?.representative?.middleInitial || ""}
                      representativeAddress={activeApplication?.representative?.streetAddress || ""}
                      representativeCityStateZip={
                        activeApplication?.representative 
                          ? `${activeApplication.representative.city || ""}${activeApplication.representative.state ? ", " + activeApplication.representative.state : ""}${activeApplication.representative.zipCode ? " " + activeApplication.representative.zipCode : ""}` 
                          : ""
                      }
                      representativeRelation={activeApplication?.representative?.relationship || ""}
                      representativeHomePhone={activeApplication?.representative?.homePhone || ""}
                      representativeWorkPhone={activeApplication?.representative?.workPhone || ""}

                      transportFeePerDog={transportFee}
                      spayNeuterFeePerDog={spayNeuterFee}
                      dueDay={dueDay}
                      lateFee={lateFee}

                      pets={
                        (selectedQuoteGroup?.quotes || []).map((q: any) => ({
                          name: q.pet?.name || "N/A",
                          species: q.pet?.species || "Dog",
                          gender: q.pet?.gender || "MALE",
                          spayedNeutered: q.pet?.isSpayedNeutered ? "Yes" : "No",
                          primaryBreed: q.pet?.primaryBreed || "Unknown",
                          additionalBreed: q.pet?.additionalBreed || "None",
                          colorsAndCoat: q.pet?.colorsAndCoat || "N/A",
                          birthday: q.pet?.birthday,
                          isMicrochipped: q.pet?.isMicrochipped ? "Yes" : "No",
                          microchipNumber: q.pet?.microchipNumber,
                          petCharge: Number(q.pet?.petCharge || q.petCharge || 0),
                        }))
                      }
                      setupFee={Number(selectedQuoteGroup?.setupFee || 0)}
                      totalMonthlyCharge={Number(selectedQuoteGroup?.totalMonthlyCharge || 0)}
                      isSigned={isAlreadySigned || hasSigned || typedName.trim().length > 0}
                      signatureDocUrl={
                        isAlreadySigned
                          ? currentAgreement?.signatureDocUrl
                          : signatureMode === "type" && typedName.trim().length > 0
                          ? "TYPED:" + typedName.trim()
                          : signatureMode === "draw" && hasSigned
                          ? drawnSignatureUrl
                          : null
                      }
                      signedDate={currentAgreement?.signedAt || null}
                      healthAnswers={healthAnswers}
                      familyHealthHistories={familyHealthHistories}
                      representativeSignatureUrl={representativeSignatureUrl}
                    />
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

              <style>{`
                .sig-canvas-wrapper {
                  position: relative;
                  border: 2px dashed #cbd5e1;
                  border-radius: 0.75rem;
                  background-color: #ffffff;
                  overflow: hidden;
                  transition: all 0.2s;
                }
                .sig-canvas-wrapper:hover {
                  border-color: var(--primary);
                }
                .sig-canvas-wrapper canvas {
                  cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%233b82f6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z'></path><path d='m15 5 4 4'></path></svg>") 0 20, crosshair !important;
                  width: 100% !important;
                  height: 100% !important;
                  touch-action: none !important;
                }
                .sig-guideline {
                  position: absolute;
                  left: 10%;
                  right: 10%;
                  bottom: 60px;
                  border-top: 1px dashed #cbd5e1;
                  pointer-events: none;
                  text-align: center;
                  color: #94a3b8;
                  font-size: 0.75rem;
                  padding-top: 4px;
                }
              `}</style>

              <div className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-primary/30 bg-white shadow-sm h-full">
                {/* Tabs switcher */}
                {isAlreadySigned ? (
                  <div className="flex border-b border-slate-200 opacity-60 pointer-events-none shrink-0">
                    <button
                      type="button"
                      className={`flex-1 py-3 text-center text-sm font-semibold border-b-2 border-primary text-primary bg-primary/[0.02]`}
                    >
                      {currentAgreement?.signatureDocUrl?.endsWith(".pdf") || currentAgreement?.signatureDocUrl?.endsWith(".doc") || currentAgreement?.signatureDocUrl?.endsWith(".docx")
                        ? "Uploaded Agreement Document"
                        : "Digital Signature Locked"}
                    </button>
                  </div>
                ) : (
                  <div className="flex border-b border-slate-200 shrink-0">
                    <button
                      type="button"
                      onClick={() => setSignatureMode("draw")}
                      className={`flex-1 py-3 text-center text-sm font-semibold border-b-2 transition-all ${
                        signatureMode === "draw"
                          ? "border-primary text-primary bg-primary/[0.02]"
                          : "border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      Draw Signature
                    </button>
                    <button
                      type="button"
                      onClick={() => setSignatureMode("type")}
                      className={`flex-1 py-3 text-center text-sm font-semibold border-b-2 transition-all ${
                        signatureMode === "type"
                          ? "border-primary text-primary bg-primary/[0.02]"
                          : "border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      Type Signature
                    </button>
                  </div>
                )}

                <div className="border-b border-slate-200 px-5 py-4 shrink-0">
                  <h3 className="text-lg font-bold text-secondary">
                    {isAlreadySigned
                      ? "Agreement Signature Completed"
                      : signatureMode === "draw"
                      ? "Sign agreement digitally"
                      : signatureMode === "type"
                      ? "Type your signature"
                      : ""}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isAlreadySigned
                      ? "Review your locked signature information below."
                      : signatureMode === "draw"
                      ? "Draw your signature on the pad below to sign. Review the document on the left before signing."
                      : signatureMode === "type"
                      ? "Type your name below to generate a cursive signature. Review the document on the left before signing."
                      : ""}
                  </p>
                </div>

                <form onSubmit={form.handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col overflow-hidden h-full">
                  <div 
                    className="min-h-0 flex-1 space-y-5 overflow-y-auto style-scrollbar p-5 h-full relative"
                    data-lenis-prevent
                  >
                    {isAlreadySigned ? (
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-4">
                        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-lg bg-white min-h-[180px]">
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">
                            Persisted Digital Signature
                          </p>
                          {currentAgreement?.signatureDocUrl ? (
                            currentAgreement.signatureDocUrl.endsWith(".pdf") || currentAgreement.signatureDocUrl.endsWith(".doc") || currentAgreement.signatureDocUrl.endsWith(".docx") ? (
                              <a
                                href={currentAgreement.signatureDocUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-primary font-medium hover:underline text-sm"
                              >
                                <Download size={16} />
                                View Signed Document
                              </a>
                            ) : (
                              <img
                                src={currentAgreement.signatureDocUrl}
                                alt="User Signature"
                                className="max-h-[100px] object-contain border border-slate-100 p-2 rounded bg-slate-50"
                              />
                            )
                          ) : (
                            <span className="text-sm text-slate-400">Signature not found</span>
                          )}
                        </div>
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 flex items-start gap-2">
                          <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5" />
                          <p className="text-[11px] text-emerald-800">
                            You have successfully signed this agreement. Your choice of signature is locked and cannot be edited.
                          </p>
                        </div>
                      </div>
                    ) : signatureMode === "draw" ? (
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-4">
                        <div ref={sigCanvasWrapperRef} className="relative sig-canvas-wrapper" style={{ height: "220px" }}>
                          {/* Guideline element */}
                          {!hasSigned && (
                            <div className="sig-guideline">
                              x ___________________________________________
                              <span className="block mt-1 text-[10px] uppercase tracking-wider text-slate-400">
                                Sign here using your mouse or touchscreen
                              </span>
                            </div>
                          )}
                          
                          {/* Signature canvas */}
                          <canvas
                            ref={sigCanvasRef}
                            width={canvasWidth}
                            height={canvasHeight}
                            className="w-full h-full block rounded-xl touch-none"
                            style={{ width: "100%", height: "100%", touchAction: "none", cursor: "crosshair" }}
                            onMouseDown={startDraw}
                            onMouseMove={draw}
                            onMouseUp={endDraw}
                            onMouseLeave={endDraw}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <p className="text-[11px] text-slate-500 max-w-[70%]">
                            Your signature will be securely uploaded and linked to the contract.
                          </p>
                          {hasSigned && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={clearCanvas}
                              className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 h-8 px-2 gap-1 rounded"
                            >
                              <X size={14} />
                              Clear Pad
                            </Button>
                          )}
                        </div>
                      </div>
                    ) : signatureMode === "type" ? (
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-4">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-600 block">
                            Type your full name
                          </label>
                          <input
                            type="text"
                            value={typedName}
                            onChange={(e) => setTypedName(e.target.value)}
                            placeholder="John Doe"
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-primary text-sm text-slate-800"
                            maxLength={40}
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <span className="text-xs font-semibold text-slate-500 block">
                            Signature Preview
                          </span>
                          <div className="flex flex-col items-center justify-center p-6 border border-slate-200 rounded-xl bg-white min-h-[140px]">
                            <p
                              style={{ fontFamily: "'Caveat', 'Pacifico', cursive" }}
                              className="text-4xl text-blue-900 text-center select-none py-6 pointer-events-none"
                            >
                              {typedName.trim() || "Your Signature"}
                            </p>
                          </div>
                        </div>
                        
                        <p className="text-[11px] text-slate-500">
                          A cursive handwriting style image will be generated and uploaded as your signature.
                        </p>
                      </div>
                    ) : null}

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
                                disabled={isAlreadySigned}
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
