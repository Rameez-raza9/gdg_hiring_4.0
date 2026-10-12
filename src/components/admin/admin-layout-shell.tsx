"use client";

import { usePathname } from "next/navigation";

export default function AdminLayoutShell({
  sidebar,
  header,
  children,
}: {
  sidebar: React.ReactNode;
  header: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isTV = pathname.includes("/attendance/tv");

  if (isTV) {
    return <div className="min-h-screen w-full bg-[#070B14] overflow-x-hidden">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[256px_1fr]">
      {sidebar}
      <div className="min-w-0">
        {header}
        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
