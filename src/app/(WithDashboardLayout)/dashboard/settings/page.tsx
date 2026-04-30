import AppLayout from "@/app/component/dashboard/AppLayout";
import MailingAddressForm from "@/app/component/dashboard/MailingAddressForm";
import PasswordForm from "@/app/component/dashboard/PasswordForm";
import ProfileForm from "@/app/component/dashboard/ProfileForm";

export default function SettingsPage() {
  return (
    <AppLayout>
      <div className="container mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-secondary">Settings</h1>
          <p className="text-base text-muted-foreground mt-1.5">
            Manage your account details and preferences.
          </p>
        </div>

        <div className="space-y-5">
          <ProfileForm />
          <PasswordForm />
          <MailingAddressForm />
        </div>
      </div>
    </AppLayout>
  );
}
