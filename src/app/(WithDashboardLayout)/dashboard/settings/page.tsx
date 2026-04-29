import AppLayout from "@/app/component/dashboard/AppLayout";
import MailingAddressForm from "@/app/component/dashboard/MailingAddressForm";
import PasswordForm from "@/app/component/dashboard/PasswordForm";
import ProfileForm from "@/app/component/dashboard/ProfileForm";

export default function SettingsPage() {
  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
          <p className="text-sm text-slate-500 mt-1">
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
