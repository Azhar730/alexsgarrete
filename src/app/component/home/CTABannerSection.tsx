import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function CTABannerSection() {
  return (
    <section className="relative w-full min-h-[340px] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/dogs-field.jpg"
          alt="Dogs playing in field"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content — right aligned */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex justify-end">
        <div className="max-w-sm text-right">
          <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-6 drop-shadow">
            A Second Chance. A Lasting Legacy
          </h2>
          <Button className="bg-white/20 backdrop-blur-sm border border-white/50 text-white hover:bg-white hover:text-[#5B6BBF] transition-all duration-300 rounded-full px-6 py-3 text-base font-semibold gap-2">
            Get started
            <span className="w-7 h-7 rounded-full bg-white/30 flex items-center justify-center">
              <ArrowRight size={14} />
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
}
