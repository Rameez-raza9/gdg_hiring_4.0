import { Suspense } from "react";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import DotsDock from "@/components/dots-dock";
import SiteFooter from "@/components/site-footer";
import HideOnAdmin from "@/components/hide-on-admin";
import TeardropCursor from "@/components/teardrop-cursor";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";

const googleSans = localFont({
  src: [
    {
      path: "../../public/fonts/GoogleSans-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/GoogleSans-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-google-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${SITE_NAME} | Sri Vasavi Engineering College`,
  description: SITE_DESCRIPTION,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${googleSans.variable} font-sans`}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-blue-100 selection:text-blue-900">
        <main>{children}</main>
        <Suspense fallback={null}>
          <HideOnAdmin>
            <SiteFooter />
            <DotsDock />
          </HideOnAdmin>
        </Suspense>
        <TeardropCursor />
      </body>
    </html>
  );
}
