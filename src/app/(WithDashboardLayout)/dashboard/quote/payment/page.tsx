import { Suspense } from "react";
import CompletePayment from "@/app/component/dashboard/CompletePayment";

export default function PaymentPage() {
  return (
    <Suspense fallback={null}>
      <CompletePayment />
    </Suspense>
  );
}
