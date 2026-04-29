import Image from "next/image";

const features = [
  { src: "/feature-1.png", title: "Secure care\nplanning" },
  { src: "/feature-2.png", title: "Trusted facility\nhandling" },
  { src: "/feature-3.png", title: "Legally backed\nagreement" },
  { src: "/feature-4.png", title: "Monthly flexible\nplan" },
];

export default function FeaturesSection() {
  return (
    <div className="container mx-auto px-4 ">
      <div className="bg-gray-100 p-6 rounded-3xl">
        <h2 className="text-3xl font-bold text-center text-gray-700 mb-12">Features</h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {features.map((feature) => (
            <div key={feature.title} className="relative flex-shrink-0">
              <Image
                src={feature.src}
                alt={feature.title}
                width={294}
                height={849}
              />
              {/* Text overlay — bottom-center, exactly like 2nd image */}
              <p
                className="absolute bottom-10 lg:bottom-16 left-0 right-0 text-center text-white px-2 leading-snug text-xl lg:text-2xl"
                style={{
                  fontWeight: 400,
                  whiteSpace: "pre-line",
                }}
              >
                {feature.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}