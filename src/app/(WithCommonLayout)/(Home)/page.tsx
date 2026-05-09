import AboutSection from "@/app/component/home/AboutSection";
import CTABannerSection from "@/app/component/home/CTABannerSection";
import FAQSection from "@/app/component/home/FAQSection";
import FeaturesSection from "@/app/component/home/FeaturesSection";
import Footer from "@/app/component/home/Footer";
import HeroSection from "@/app/component/home/HeroSection";
import HowItWorksSection from "@/app/component/home/HowItWorksSection";
import { Header } from "@/components/header";
import PricingSection from "@/app/component/home/PricingSection";
import Navbar from "@/app/component/home/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      {/* <Navbar/> */}
      {/* Add pt-16 to offset fixed navbar */}
      <div>
        <HeroSection />
        <div >
          <HowItWorksSection  />
          <AboutSection />
          <FeaturesSection />
          <PricingSection />
          <FAQSection />
          <CTABannerSection />
        </div>
        <Footer />
      </div>
    </main>
  );
}
