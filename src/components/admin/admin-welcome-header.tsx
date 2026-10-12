"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Dot, G } from "@/components/dot";
import { PageHeader, btnGhost, btnPrimary } from "@/components/admin/ui";
import { ApplicationToggle } from "@/components/admin/application-toggle";

export function AdminWelcomeHeader() {
  const [firstName, setFirstName] = useState("Admin");

  useEffect(() => {
    const cached = sessionStorage.getItem("gdg_admin_name");
    if (cached) {
      const parts = cached.trim().split(" ");
      setFirstName(parts[0] || "Admin");
    }
  }, []);

  return (
    <div className="mb-8 flex items-center gap-5">
      <div className="hidden sm:block">
        <Dot size={72} color={G.blue} shape="lean" />
      </div>
      <PageHeader
        title={`Welcome back, ${firstName}`}
        description="Here is where recruitment stands today."
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            <ApplicationToggle />
            <Link href="/admin/reviews" className={btnGhost}>
              Open pipeline
            </Link>
            <Link href="/admin/applications" className={btnPrimary}>
              Review applications
            </Link>
          </div>
        }
      />
    </div>
  );
}
