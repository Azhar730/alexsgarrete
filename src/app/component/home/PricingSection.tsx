import { PawPrint, CheckCircle } from "lucide-react";

const plans = [
  {
    icon: PawPrint,
    title: "Personalized Plans",
    description: "Plans are personalized based on your dog and information.",
    highlight: false,
  },
  {
    icon: CheckCircle,
    title: "No Pressure Commitment",
    description: "No commitment until you review your plan.",
    highlight: false,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-16 bg-[#8A9DD8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-white mb-10">Transparent Pricing</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.title}
                className="bg-[#7B8FCE]/70 backdrop-blur-sm rounded-2xl p-8 flex flex-col items-center text-center gap-4 border border-white/20 hover:bg-[#7B8FCE] transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Icon className="text-white" size={22} />
                </div>
                <h3 className="text-white font-bold text-lg">{plan.title}</h3>
                <p className="text-white/80 text-sm leading-relaxed">{plan.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
