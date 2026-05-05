import Image from "next/image";

export function MeetHeroSection() {
  return (
    <div>
      <section className="py-10 px-4 md:px-8">
      <div className="container mx-auto flex flex-col lg:flex-row items-start gap-12 lg:gap-16">

        {/* ════════════════════════════════════════════
            LEFT: Staggered photo collage
            Height must contain the tallest photo stack
        ════════════════════════════════════════════ */}
        <div
          className="
            relative w-full flex-1 shrink-0
            h-[360px]
            sm:h-[472px]
            md:h-[730px]
            lg:h-[1140px]
          "
        >

          {/* ── PHOTO 1: Person with dog in yard ──────────────────────────
              Position: absolute left=0, behind right photos (z-10)
              Starts below about-2's midpoint to create the stagger effect.

              xs:  top=144px (9rem)  w=105  h=194
              sm:  top=160px (10rem) w=140  h=258
              md:  top=176px (11rem) w=220  h=406
              lg:  top=224px (14rem) w=359  h=662  ← original top-56
          ────────────────────────────────────────────────────────────── */}
          <div
            className="
              absolute left-0 z-10
              overflow-hidden rounded-2xl border-4 border-white shadow-xl

              top-36
              w-[105px] h-[194px]

              sm:top-40
              sm:w-[140px] sm:h-[258px]

              md:top-44
              md:w-[220px] md:h-[406px]

              lg:top-56
              lg:w-[359px] lg:h-[662px]
            "
          >
            <Image
              src="/about-1.png"
              alt="Person with dog in yard"
              fill
              className="object-cover object-center"
              unoptimized
            />
          </div>

          {/* ── PHOTO 2: Hero the dog (front-right top) ───────────────────
              Position: absolute right=0  top=0  (always anchored to top)
              Front layer (z-20), partially overlapped by about-1 vertically.

              xs:  w=105  h=134
              sm:  w=140  h=178
              md:  w=220  h=280
              lg:  w=360  h=458  ← original
          ────────────────────────────────────────────────────────────── */}
          <div
            className="
              absolute right-0 top-0 z-20
              overflow-hidden rounded-2xl border-4 border-white shadow-xl

              w-[105px] h-[134px]
              sm:w-[140px] sm:h-[178px]
              md:w-[220px] md:h-[280px]
              lg:w-[360px] lg:h-[458px]
            "
          >
            <Image
              src="/about-2.png"
              alt="Hero the dog"
              fill
              className="object-cover object-center"
              unoptimized
            />
            <div className="absolute bottom-0 inset-x-0 bg-black/50 px-3 py-2">
              <p className="text-white text-xs font-bold">Hero</p>
              <p className="text-white/70 text-[10px] uppercase tracking-widest">OUR INSPIRATION</p>
            </div>
          </div>

          {/* ── PHOTO 3: Wendy the owner with dog (front-right bottom) ────
              Position: right=0, top = about-2.height + 12px gap
              Continues the right column right below about-2.

              xs:  top=146px  (134 + 12)  w=105  h=197
              sm:  top=190px  (178 + 12)  w=140  h=263
              md:  top=292px  (280 + 12)  w=220  h=413
              lg:  top=480px  (top-120 original)  w=360  h=676
          ────────────────────────────────────────────────────────────── */}
          <div
            className="
              absolute right-0 z-20
              overflow-hidden rounded-2xl border-4 border-white shadow-xl

              top-[146px]
              w-[105px] h-[197px]

              sm:top-[190px]
              sm:w-[140px] sm:h-[263px]

              md:top-[292px]
              md:w-[220px] md:h-[413px]

              lg:top-[480px]
              lg:w-[360px] lg:h-[676px]
            "
          >
            <Image
              src="/about-3.png"
              alt="Wendy the owner with dog"
              fill
              className="object-cover object-center"
              unoptimized
            />
            <div className="absolute bottom-0 inset-x-0 bg-black/50 px-3 py-2">
              <p className="text-white text-xs font-bold">Wendy</p>
              <p className="text-white/70 text-[10px] uppercase tracking-widest">THE OWNER</p>
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