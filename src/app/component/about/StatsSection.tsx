const STATS = [
  {
    value: "30%",
    label: "OF DOGS END UP IN SHELTERS AFTER AN OWNER'S PASSING",
  },
  {
    value: "1000s",
    label: "OF DOGS AFFECTED EVERY YEAR",
  },
  {
    value: "100%",
    label: "DEDICATED TO HAPPY ENDINGS",
  },
];

export function StatsSection() {
  return (
    <div className="bg-[#5C7FC4] container mx-auto rounded-2xl">
      
    <section className="  md:mx-8 my-6 py-12 px-6">
      <div className=" grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
        {STATS.map((stat) => (
          <div key={stat.value} className="flex flex-col items-center gap-2">
            <span
              className="text-4xl md:text-5xl font-extrabold text-white tracking-tight"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              {stat.value}
            </span>
            <p className="text-white/70 text-[10px] uppercase tracking-widest leading-snug max-w-[140px]">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
    </div>
  );
}
