import AppLayout from "@/app/component/dashboard/AppLayout";
import { BillingHistory, PaymentMethod, PaymentSummaryCards } from "@/app/component/dashboard/PaymentComponents";


export default function PaymentsPage() {
  return (
    <AppLayout>
      <div className="container mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-800">Payments</h1>
          <p className="text-base text-slate-500 mt-1.5">
            Manage your payment methods and cards
          </p>
        </div>

        <PaymentSummaryCards />
        <PaymentMethod />
        <BillingHistory />
      </div>
    </AppLayout>
  );
}
