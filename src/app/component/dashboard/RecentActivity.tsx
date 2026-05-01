import { CreditCard, Shield, CheckCircle, Send } from "lucide-react";

const activities = [
  {
    id: "1",
    icon: CreditCard,
    title: "Payment successful for 3 active plans",
    description:
      "Today, 10:45 AM • Combined monthly payment of $132.00 processed via Visa ending in 4242",
  },
  {
    id: "2",
    icon: Shield,
    title: "Coco's plan activated",
    description:
      "Today, 9:20 AM • Wellness Plus coverage is now live and effective immediately",
  },
  {
    id: "3",
    icon: CheckCircle,
    title: "Milo quote accepted",
    description:
      "Yesterday, 2:30 PM • Coverage confirmed and billing automatically added to your account",
  },
  {
    id: "4",
    icon: Send,
    title: "Bella's plan is ready!",
    description:
      "Oct 26, 2023, 9:15 AM • Digital documents and policy welcome package sent to sarah.j@example.com",
  },
];

export default function RecentActivity() {
  return (
    <section>
      <h2 className="text-xl font-bold text-secondary mb-4">Recent activity</h2>
      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
        {activities.map(({ id, icon: Icon, title, description }) => (
          <div key={id} className="flex items-start gap-4 p-4">
            <div
              className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5"
            >
              <Icon size={15} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-base font-semibold text-secondary">{title}</p>
              <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
