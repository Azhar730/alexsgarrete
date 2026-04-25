import AboutSection from "@/app/component/home/AboutSection";
import CTABannerSection from "@/app/component/home/CTABannerSection";
import FAQSection from "@/app/component/home/FAQSection";
import FeaturesSection from "@/app/component/home/FeaturesSection";
import Footer from "@/app/component/home/Footer";
import HeroSection from "@/app/component/home/HeroSection";
import HowItWorksSection from "@/app/component/home/HowItWorksSection";
import Navbar from "@/app/component/home/Navbar";
import PricingSection from "@/app/component/home/PricingSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Add pt-16 to offset fixed navbar */}
      <div className="pt-16">
        <HeroSection />
        <HowItWorksSection />
        <AboutSection />
        <FeaturesSection />
        <PricingSection />
        <FAQSection />
        <CTABannerSection />
        <Footer />
      </div>
    </main>
  );
}
