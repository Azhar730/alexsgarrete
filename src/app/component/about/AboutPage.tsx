import { AboutHero } from "./AboutHero";
import { MissionSection } from "./MissionSection";
import { MeetHeroSection } from "./MeetHeroSection";
import { BeliefSection } from "./BeliefSection";
import { StatsSection } from "./StatsSection";
import { CTASection } from "./CTASection";
import Footer from "../home/Footer";

export function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* 1. Blue hero banner */}
      <AboutHero />

      {/* 2. Mission text */}
      <MissionSection />

      {/* 3. Staggered photos + Meet Hero story */}
      <MeetHeroSection />

      {/* 4. Built by Dog People — belief card */}
      <BeliefSection />

      {/* 5. Stats bar */}
      <StatsSection />

      {/* 6. CTA card */}
      <CTASection />

      {/* 7. Footer */}
      <Footer />
    </div>
  );
}
