import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Encore - Pet Insurance Dashboard",
  description: "Manage your pet insurance plans",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
    </>
  );
}