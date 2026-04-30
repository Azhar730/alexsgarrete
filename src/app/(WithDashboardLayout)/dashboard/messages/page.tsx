import AppLayout from "@/app/component/dashboard/AppLayout";
import MessagesPage from "@/app/component/dashboard/MessagesPage";


export default function Messages() {
  return (
    <AppLayout>
      <div className="container mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-secondary">Messages</h1>
          <p className="text-base text-muted-foreground mt-1.5">
            Chat with our support team and review important notifications.
          </p>
        </div>
        <MessagesPage />
      </div>
    </AppLayout>
  );
}
