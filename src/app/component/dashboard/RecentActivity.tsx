import { CreditCard, Shield, CheckCircle, Send } from "lucide-react";

const activities = [
  {
    id: "1",
    icon: CreditCard,
    // iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    title: "Payment successful for 3 active plans",
    description:
      "Today, 10:45 AM • Combined monthly payment of $132.00 processed via Visa ending in 4242",
  },
  {
    id: "2",
    icon: Shield,
    // iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    title: "Coco's plan activated",
    description:
      "Today, 9:20 AM • Wellness Plus coverage is now live and effective immediately",
  },
  {
    id: "3",
    icon: CheckCircle,
    // iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    title: "Milo quote accepted",
    description:
      "Yesterday, 2:30 PM • Coverage confirmed and billing automatically added to your account",
  },
  {
    id: "4",
    icon: Send,
    // iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    title: "Bella's plan is ready!",
    description:
      "Oct 26, 2023, 9:15 AM • Digital documents and policy welcome package sent to sarah.j@example.com",
  },
];

export default function RecentActivity() {
  return (
    <section>
      <h2 className="text-base font-bold text-slate-800 mb-4">Recent activity</h2>
      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
        {activities.map(({ id, icon: Icon,  iconColor, title, description }) => (
          <div key={id} className="flex items-start gap-4 p-4">
            <div
              className={`w-9 h-9 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5`}
            >
              <Icon size={15} className='text-white' />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-700">{title}</p>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
