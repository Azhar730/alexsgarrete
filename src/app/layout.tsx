import type { Metadata } from "next";
import "./globals.css";
import { SmoothScroll } from "@/components/smooth-scroll";
import ReduxProvider from "@/redux/provider/ReduxProvider";

import { inter, jetbrainsMono } from "./fonts";
import { Header } from "@/components/header";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "k9 Encore",
  description: "Loving Care When You're No Longer There",
};
// test its added
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <ReduxProvider>
          <SmoothScroll>
            {children}
            <Toaster position="top-center" richColors />
          </SmoothScroll>
        </ReduxProvider>
      </body>
    </html>
  );
}
