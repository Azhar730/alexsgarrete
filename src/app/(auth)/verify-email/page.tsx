import { Suspense } from "react";
import VerifyEmailPage from "@/app/component/auth/VerifyEmailPage";

function VerifyEmail() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailPage />
    </Suspense>
  );
}

export default VerifyEmail;