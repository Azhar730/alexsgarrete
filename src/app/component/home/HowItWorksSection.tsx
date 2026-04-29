import Image from "next/image";

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="px-4 sm:px-4 py-4 sm:py-6 bg-white container mx-auto">

      {/* Row 1 */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">

        {/* Card 1 — "How it works" label */}
        <div className="sm:flex-[1.2] min-w-0 relative rounded-2xl overflow-hidden min-h-[120px] sm:min-h-0">
          <Image
            src="/how-works.png"
            alt="How it works"
            width={444}
            height={300}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-3">
            <h2 className="text-primary font-bold leading-tight mb-1 text-center
                           text-xl sm:text-2xl md:text-3xl lg:text-4xl">
              How it works
            </h2>
            <p className="text-gray-500 text-center leading-snug
                          text-xs sm:text-sm md:text-base lg:text-xl">
              A simple process designed to<br />secure your dog&apos;s future care
            </p>
          </div>
        </div>

        {/* Card 2 — Submit your information */}
        <div className="sm:flex-[1.6] min-w-0 relative rounded-2xl overflow-hidden min-h-[120px] sm:min-h-0">
          <Image
            src="/submit-information.png"
            alt="Submit Information"
            width={557}
            height={300}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-5 py-3 sm:py-4">
            <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white text-primary text-[10px] sm:text-xs font-bold flex items-center justify-center">
              1
            </span>
            <p className="text-white font-bold leading-tight
                          text-lg sm:text-xl md:text-2xl lg:text-4xl">
              Submit your<br />information
            </p>
          </div>
        </div>

        {/* Card 3 — Receive your personalized plan */}
        <div className="sm:flex-[2.4] min-w-0 relative rounded-2xl overflow-hidden min-h-[120px] sm:min-h-0">
          <Image
            src="/recive-plan.png"
            alt="Receive your personalized plan"
            width={821}
            height={300}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-5 py-3 sm:py-4">
            <div className="flex justify-end">
              <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white text-primary text-[10px] sm:text-xs font-bold flex items-center justify-center">
                2
              </span>
            </div>
            <p className="text-white font-bold leading-tight text-right
                          text-lg sm:text-xl md:text-2xl lg:text-4xl">
              Receive your<br />personalized plan
            </p>
          </div>
        </div>

      </div>

      {/* Row 2 */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full mt-3 sm:mt-4">

        {/* Card 4 — Dogs photo (no text overlay) */}
        <div className="sm:flex-[1.6] min-w-0 relative rounded-2xl overflow-hidden min-h-[120px] sm:min-h-0">
          <Image
            src="/dogs.png"
            alt="Dogs in park"
            width={557}
            height={300}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Card 5 — Review and sign agreement */}
        <div className="sm:flex-[1.6] min-w-0 relative rounded-2xl overflow-hidden min-h-[120px] sm:min-h-0">
          <Image
            src="/review-agreement.png"
            alt="Review and sign agreement"
            width={557}
            height={300}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-5 py-3 sm:py-4">
            <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white text-primary text-[10px] sm:text-xs font-bold flex items-center justify-center">
              3
            </span>
            <p className="text-white font-bold leading-tight
                          text-lg sm:text-xl md:text-2xl lg:text-4xl">
              Review and sign<br />agreement
            </p>
          </div>
        </div>

        {/* Card 6 — Activate your plan */}
        <div className="sm:flex-[2.1] min-w-0 relative rounded-2xl overflow-hidden min-h-[120px] sm:min-h-0">
          <Image
            src="/activate-plan.png"
            alt="Activate your plan"
            width={708}
            height={300}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-5 py-3 sm:py-4">
            <div className="flex justify-end">
              <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white text-primary text-[10px] sm:text-xs font-bold flex items-center justify-center">
                4
              </span>
            </div>
            <p className="text-white font-bold leading-tight text-right
                          text-lg sm:text-xl md:text-2xl lg:text-4xl">
              Activate your<br />plan
            </p>
          </div>
        </div>

      </div>

    </section>
  );
}