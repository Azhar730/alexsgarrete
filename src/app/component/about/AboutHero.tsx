import Image from "next/image";

export function AboutHero() {
  return (
   <div className="container mx-auto">
     <section className="bg-primary rounded-2xl md:mx-8 mt-6 px-6 py-16 flex flex-col items-center text-center">
      {/* Logo */}
      <Image
        src="/encore-k9.png"
        alt="K9 Encore Logo"
        width={400}
        height={97}
      />

      {/* Title */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight max-w-2xl"
        style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
      >
        About K9 Encore
      </h1>

      {/* Subtitle */}
      <p className="mt-4 text-white/80 text-sm md:text-base max-w-md leading-relaxed">
        Ensuring every dog has a plan because their journey shouldn&apos;t end with yours.
      </p>
    </section>
   </div>
  );
}
