import { Check } from "lucide-react";

const BELIEFS = [
  "Legally backed agreements for true peace of mind",
  "Personalized care plans tailored to your dog's needs",
  "Seamless transition for your dog during a difficult time",
  "Trusted network of vetted dog care professionals",
];

export function BeliefSection() {
  return (
    <div className="container mx-auto">
      <section className="py-12 px-4 md:px-8 bg-[#EEF4FB] rounded-2xl  my-6">
          {/* Section label + heading */}
          <div className="text-center mb-10">
            <p className="text-[#7B9BD0] text-xs font-bold uppercase tracking-widest mb-2">
              OUR ROOTS
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-snug mb-4"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Built by Dog People, for Dog People
            </h2>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-lg mx-auto">
              K9 Encore was born from years of firsthand experience caring for
              dogs and witnessing the gaps in end-of-life planning.
            </p>
          </div>

          {/* White card */}
          <div className="bg-white  max-w-5xl mx-auto rounded-2xl shadow-sm border border-slate-100 p-8 md:p-10">
            <h3
              className="text-xl md:text-2xl font-bold text-slate-900 mb-3"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              A Simple Belief
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-7 max-w-lg">
              With the help of K9 Encore, there is an alternative and happy
              endings are possible. At the heart of K9 Encore is a simple
              belief: all dogs&apos; lifelong journeys shouldn&apos;t end with
              you.
            </p>

            {/* 2-col checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 rounded-lg">
              {BELIEFS.map((belief) => (
                <div
                  key={belief}
                  className="flex items-start gap-2.5 bg-muted-foreground/10 rounded-lg px-4 py-3"
                >
                  <div className="w-4.5 h-4.5 rounded-full bg-[#7B9BD0]/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Check
                      className="w-3 h-3 text-[#5C7FC4]"
                      strokeWidth={2.5}
                    />
                  </div>
                  <span className="text-slate-600 text-sm leading-snug">
                    {belief}
                  </span>
                </div>
              ))}
            </div>
        </div>
      </section>
    </div>
  );
}
