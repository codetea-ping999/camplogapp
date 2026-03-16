import type { Metadata, Viewport } from "next";
import { Manrope, Sora } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/components/providers/app-provider";
import { ServiceWorkerRegister } from "@/components/pwa/service-worker-register";
import { OfflineIndicator } from "@/components/pwa/offline-indicator";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CampLog",
  description: "Outdoor-first camp log app with gear tracking and photo memories.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "CampLog",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f1e18",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${sora.variable} antialiased`}>
        <AppProvider>
          <ServiceWorkerRegister />
          <OfflineIndicator />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
