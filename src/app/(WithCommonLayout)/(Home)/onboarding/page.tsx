import { ApplicationProvider } from "@/app/component/onboarding/application-context";
import { ApplicationFlow } from "@/app/component/onboarding/ApplicationFlow";

export default function ApplicationPage() {
  return (
    <ApplicationProvider>
      <ApplicationFlow />
    </ApplicationProvider>
  );
}
