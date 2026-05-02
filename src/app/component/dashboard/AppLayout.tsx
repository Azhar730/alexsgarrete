import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-primary/5 flex">
      <Sidebar />
      <div className="flex-1 md:ml-60 flex flex-col min-h-screen">
        <DashboardHeader />
        <main className="flex-1 p-4 md:p-8 max-w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
