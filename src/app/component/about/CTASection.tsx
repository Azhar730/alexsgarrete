import Link from "next/link";

export function CTASection() {
  return (
    <section className="px-4">
      <div className="container mx-auto bg-muted-foreground/10 rounded-3xl px-4 py-14 md:py-16">
        <div className=" rounded-3xl px-8 py-14 md:py-6 flex flex-col items-center text-center">
          <h2
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight leading-snug mb-3"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Give Your Dog the Gift of Security
          </h2>
          <p className="text-slate-500 text-sm md:text-base leading-relaxed mb-8 max-w-md">
            Start planning today and make sure your dog&apos;s story has a happy ending no matter
            what.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-[#7B9BD0] hover:bg-[#5C7FC4] text-white font-semibold text-sm px-8 py-3 rounded-full transition-colors shadow-sm"
          >
            Get started
          </Link>
        </div>
      </div>
    </section>
  );
}
