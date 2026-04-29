import AppLayout from "@/app/component/dashboard/AppLayout";
import MessagesPage from "@/app/component/dashboard/MessagesPage";


export default function Messages() {
  return (
    <AppLayout>
      <div className="container mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Messages</h1>
          <p className="text-sm text-slate-500 mt-1">
            Chat with our support team and review important notifications.
          </p>
        </div>
        <MessagesPage />
      </div>
    </AppLayout>
  );
}
