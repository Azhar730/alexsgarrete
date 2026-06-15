import Image from "next/image";

export function MeetHeroSection() {
  return (
    <div>
      <section className="py-10 px-4 md:px-8">
      <div className="container mx-auto flex flex-col lg:flex-row items-start lg:items-center gap-12 lg:gap-16">

        {/* ════════════════════════════════════════════
            LEFT: Staggered photo grid (Responsive)
        ════════════════════════════════════════════ */}
        <div className="w-full lg:flex-1 shrink-0 grid grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          
          {/* Left Column (Staggered down) */}
          <div className="flex flex-col pt-12 sm:pt-20 lg:pt-24">
            <div className="relative w-full aspect-[3/5] rounded-2xl overflow-hidden shadow-xl border-4 border-white">
              <Image
                src="/about-1.png"
                alt="Person with dog in yard"
                fill
                className="object-cover object-center hover:scale-105 transition-transform duration-500"
                unoptimized
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-4 sm:gap-6 md:gap-8">
            {/* Photo 2: Hero */}
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-xl border-4 border-white group">
              <Image
                src="/about-2.png"
                alt="Hero the dog"
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                unoptimized
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent pt-8 pb-3 px-4">
                <p className="text-white text-sm sm:text-base font-bold">Hero</p>
                <p className="text-white/80 text-[10px] sm:text-xs uppercase tracking-widest">OUR INSPIRATION</p>
              </div>
            </div>

            {/* Photo 3: Wendy */}
            <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border-4 border-white group">
              <Image
                src="/about-3.png"
                alt="Wendy the owner with dog"
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                unoptimized
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent pt-8 pb-3 px-4">
                <p className="text-white text-sm sm:text-base font-bold">Wendy</p>
                <p className="text-white/80 text-[10px] sm:text-xs uppercase tracking-widest">THE OWNER</p>
              </div>
            </div>
          </div>

        </div>

        {/* ════════════════════════════════════════════
            RIGHT: Story text — unchanged from original
        ════════════════════════════════════════════ */}
        <div className="flex-1 pt-4 lg:pt-8">
          <p className="text-[#7B9BD0] text-xs font-bold uppercase tracking-widest mb-2">
            THE STORY BEHIND K9 ENCORE
          </p>

          <h2
            className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-snug mb-4"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Meet Hero
          </h2>

          <p className="text-[#7B9BD0] text-sm md:text-base leading-relaxed mb-5">
            As owners of a dog boarding and day care facility, we were often presented with
            opportunities to assist in rehoming dogs. The saddest of these requests are undoubtedly
            those dogs whose lives were upended by the passing of their owner.
          </p>

          <blockquote className="border-l-4 border-slate-300 pl-4 mb-5">
            <p className="text-slate-600 text-sm italic leading-relaxed">
              &quot;Hero was a regular at our day care for the better part of two years before one
              Monday, Hero missed his normal appointment.&quot;
            </p>
          </blockquote>

          <p className="text-slate-500 text-sm leading-relaxed mb-4">
            After 24 hours of unanswered calls to his owner Wendy, we reached out to her employer
            only to be informed that she had passed away over the weekend. Tragically, Hero was
            trapped in the house until her discovery on Monday. He was found at a local shelter.
          </p>
          <p className="text-slate-500 text-sm leading-relaxed">
            Knowing that each year thousands and thousands of dogs find themselves in the same
            situation as Hero, Hero is the inspiration behind K9 Encore.
          </p>
        </div>

      </div>
    </section>
    </div>
  );
}