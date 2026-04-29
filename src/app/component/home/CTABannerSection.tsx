import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function CTABannerSection() {
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="relative w-full min-h-[626px] rounded-3xl flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/cta-banner.png"
          alt="Dogs playing in field"
          fill
          className="object-cover object-center"
        />
        {/* <div className="absolute inset-0 bg-black/40" /> */}
      </div>

      {/* Content — right aligned */}
      <div className="relative z-10 max-w-full  mx-auto px-4 sm:px-6 lg:px-8 w-full flex justify-end">
        <div className="max-w-sm text-right">
          <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-6 drop-shadow">
            A Second Chance. A Lasting Legacy
          </h2>
          <div className="flex items-center justify-end gap-2">
              <Button
                className="bg-primary text-white cursor-pointer transition-all duration-300 rounded-full px-8 py-6 text-xl font-semibold gap-2"
              >
                Get started
              </Button>
              <span className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center">
                <ArrowRight size={20} />
              </span>
            </div>
        </div>
      </div>
    </section>
    </div>
  );
}
