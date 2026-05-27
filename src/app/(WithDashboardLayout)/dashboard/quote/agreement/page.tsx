import { Suspense } from "react";
import SignAgreement from "@/app/component/dashboard/SignAgreement";

export default function AgreementPage() {
  return (
    <Suspense fallback={null}>
      <SignAgreement />
    </Suspense>
  );
}
