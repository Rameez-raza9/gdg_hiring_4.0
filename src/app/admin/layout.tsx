import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, Bell, Search } from "lucide-react";
import AdminNav from "@/components/admin/admin-nav";
import { Avatar } from "@/components/admin/ui";
import { G } from "@/lib/brand";
import { APPLICATIONS, USERS } from "@/lib/admin-data";
import AdminGuard from "@/components/admin/admin-guard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const newCount = APPLICATIONS.filter((a) => a.status === "New").length;
  const me = USERS[0];

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background lg:grid lg:grid-cols-[256px_1fr]">
      {/* Sidebar (becomes a top bar on small screens) */}
      <aside className="border-b border-border bg-card/40 p-4 lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:border-b-0 lg:border-r lg:p-5">
        <Link href="/admin" className="mb-4 flex items-center gap-2.5 px-2 text-base font-semibold tracking-tight lg:mb-8">
          <img src="/assets/logos/main_logo.jpeg" alt="GDGoC SVEC" className="size-7 rounded-lg object-contain border border-border" />
          <span>GDGoC Admin</span>
        </Link>

        <Suspense fallback={null}>
          <AdminNav newCount={newCount} />
        </Suspense>

        <div className="mt-auto hidden space-y-4 lg:block">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to site
          </Link>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-background p-3">
            <Avatar name={me.name} color={me.color} />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{me.name}</p>
              <p className="truncate text-xs text-muted-foreground">{me.role}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Content */}
      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/80 px-6 py-3.5 backdrop-blur-xl lg:px-8">
          <label className="relative max-w-md flex-1">
            <span className="sr-only">Search</span>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search applicants, reviewers..."
              className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm outline-none placeholder:text-muted-foreground/60 focus:border-foreground/40"
            />
          </label>
          <button
            aria-label="Notifications"
            className="relative ml-auto grid size-10 place-items-center rounded-xl border border-border bg-card text-muted-foreground transition hover:text-foreground cursor-pointer"
          >
            <Bell className="size-4" />
            <span className="absolute right-2.5 top-2.5 size-2 rounded-full" style={{ background: G.red }} />
          </button>
        </header>
        <div className="p-6 lg:p-8">{children}</div>
      </div>
    </div>
    </AdminGuard>
  );
}
