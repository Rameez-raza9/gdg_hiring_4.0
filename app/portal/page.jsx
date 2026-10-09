"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminPortal from "@/components/AdminPortal";
import { useRouter } from "next/navigation";

export default function PortalPage() {
  const router = useRouter();

  return (
    <div className="app-shell portal-view-shell">
      <Header
        isPortal={true}
        onTogglePortal={() => router.push("/")}
        onStartApply={() => router.push("/#apply")}
      />
      <main className="flex-1 w-full">
        <AdminPortal onBackToForm={() => router.push("/")} />
      </main>
      <Footer
        onOpenPortal={() => {}}
        onStartApply={() => router.push("/#apply")}
      />
    </div>
  );
}
