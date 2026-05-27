import { Suspense } from "react";
import QuoteReviewCard from "@/app/component/dashboard/QuoteReviewCard";

export default function QuoteReviewPage() {
  return (
    <Suspense fallback={null}>
      <QuoteReviewCard />
    </Suspense>
  );
}
