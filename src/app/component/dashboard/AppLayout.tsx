import Sidebar from "./Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <main className="flex-1 md:ml-60 p-4 md:p-8 max-w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
