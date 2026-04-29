import AppLayout from "@/app/component/dashboard/AppLayout";
import DogProfilesSection from "@/app/component/dashboard/DogProfilesSection";
import PlanReadyCard from "@/app/component/dashboard/PlanReadyCard";
import RecentActivity from "@/app/component/dashboard/RecentActivity";


export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">
          Welcome back, Sarah
        </h1>

        <PlanReadyCard petName="Bella" breed="Golden Retriever" />
        <DogProfilesSection />
        <RecentActivity />
      </div>
    </AppLayout>
  );
}
