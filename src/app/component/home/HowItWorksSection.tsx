import Image from "next/image";

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="px-4 py-6 bg-white w-full">

      {/* Row 1 */}
      <div className="flex gap-4 w-full">

        {/* Card 1 — "How it works" label */}
        <div className="flex-[1.2] min-w-0 relative rounded-2xl overflow-hidden">
          <Image
            src="/how-works.png"
            alt="How it works"
            width={444}
            height={300}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h2
              className="text-primary text-4xl font-bold leading-tight mb-2"
            >
              How it works
            </h2>
            <p className="text-gray-500 text-xl text-center leading-snug">
              A simple process designed to<br /> secure your dog&apos;s future care
            </p>
          </div>
        </div>

        {/* Card 2 — Submit your information */}
        <div className="flex-[1.6] min-w-0 relative rounded-2xl overflow-hidden">
          <Image
            src="/submit-information.png"
            alt="Submit Information"
            width={557}
            height={300}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col justify-center px-5 py-4">
            <span className="w-6 h-6 rounded-full bg-white text-primary text-xs font-bold flex items-center justify-center">
              1
            </span>
            <p className="text-white font-bold text-3xl leading-tight">
              Submit your<br />information
            </p>
          </div>
        </div>

        {/* Card 3 — Receive your personalized plan */}
        <div className="flex-[2.4] min-w-0 relative rounded-2xl overflow-hidden">
          <Image
            src="/recive-plan.png"
            alt="Receive your personalized plan"
            width={821}
            height={300}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col justify-center px-5 py-4">
            <div className="flex justify-end">
              <span className="w-6 h-6 rounded-full bg-white text-primary text-xs font-bold flex items-center justify-center">
                2
              </span>
            </div>
            <p className="text-white font-bold text-3xl leading-tight text-right">
              Receive your<br />personalized plan
            </p>
          </div>
        </div>

      </div>

      {/* Row 2 */}
      <div className="flex gap-4 w-full mt-4">

        {/* Card 4 — Dogs photo (no text overlay, pure image) */}
        <div className="flex-[1.6] min-w-0 relative rounded-2xl overflow-hidden">
          <Image
            src="/dogs.png"
            alt="Dogs in park"
            width={557}
            height={300}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Card 5 — Review and sign agreement */}
        <div className="flex-[1.6] min-w-0 relative rounded-2xl overflow-hidden">
          <Image
            src="/review-agreement.png"
            alt="Review and sign agreement"
            width={557}
            height={300}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col justify-center px-5 py-4">
            <span className="w-6 h-6 rounded-full bg-white text-primary text-xs font-bold flex items-center justify-center">
              3
            </span>
            <p className="text-white font-bold text-3xl leading-tight">
              Review and sign<br />agreement
            </p>
          </div>
        </div>

        {/* Card 6 — Activate your plan */}
        <div className="flex-[2.1] min-w-0 relative rounded-2xl overflow-hidden">
          <Image
            src="/activate-plan.png"
            alt="Activate your plan"
            width={708}
            height={300}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col justify-center px-5 py-4">
            <div className="flex justify-end">
              <span className="w-6 h-6 rounded-full bg-white text-primary text-xs font-bold flex items-center justify-center">
                4
              </span>
            </div>
            <p className="text-white font-bold text-3xl leading-tight text-right">
              Activate your<br />plan
            </p>
          </div>
        </div>

      </div>

    </section>
  );
}