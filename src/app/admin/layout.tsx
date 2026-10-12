import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, Bell, Search } from "lucide-react";
import AdminNav from "@/components/admin/admin-nav";
import { G } from "@/lib/brand";
import { fetchLiveApplications } from "@/lib/admin-data";
import AdminGuard from "@/components/admin/admin-guard";
import { AdminUserProfile, AdminUserHeaderPill } from "@/components/admin/admin-user-profile";
import AdminLayoutShell from "@/components/admin/admin-layout-shell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const applications = await fetchLiveApplications();
  const newCount = applications.filter((a) => a.status === "New").length;

  return (
    <AdminGuard>
      <AdminLayoutShell
        sidebar={
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
              <AdminUserProfile />
            </div>
          </aside>
        }
        header={
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
            <div className="ml-auto flex items-center gap-2.5">
              <AdminUserHeaderPill />
              <button
                aria-label="Notifications"
                className="relative grid size-10 place-items-center rounded-xl border border-border bg-card text-muted-foreground transition hover:text-foreground cursor-pointer"
              >
                <Bell className="size-4" />
                <span className="absolute right-2.5 top-2.5 size-2 rounded-full" style={{ background: G.red }} />
              </button>
            </div>
          </header>
        }
      >
        {children}
      </AdminLayoutShell>
    </AdminGuard>
  );
}
