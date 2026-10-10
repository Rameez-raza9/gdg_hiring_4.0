"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Loader2, Mail, Plus, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { G } from "@/lib/brand";
import { USERS, type Role, type User, type UserStatus } from "@/lib/admin-data";
import { Avatar, Card, PageHeader, StatCard, btnPrimary } from "@/components/admin/ui";

const ROLES: Role[] = ["Admin", "Lead", "Reviewer", "Member"];
const ROLE_NOTE: Record<Role, string> = {
  Admin: "Full access, including users",
  Lead: "Manage a track and review applicants",
  Reviewer: "Score and comment on applications",
  Member: "View only",
};
const STATUS_COLOR: Record<UserStatus, string> = {
  Active: G.green,
  Invited: G.yellow,
  Suspended: G.red,
};

const field =
  "rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-foreground/40";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(USERS);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "All">("All");
  const [inviting, setInviting] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("Member");

  // Fetch live users from Turso on mount
  useEffect(() => {
    let active = true;
    async function loadUsers() {
      try {
        const res = await fetch("/api/users");
        if (res.ok) {
          const data = await res.json();
          if (active && Array.isArray(data.users) && data.users.length > 0) {
            setUsers(data.users);
          }
        }
      } catch (err) {
        console.error("Failed to load users:", err);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadUsers();
    return () => {
      active = false;
    };
  }, []);

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    return users.filter(
      (u) =>
        (roleFilter === "All" || u.role === roleFilter) &&
        (!s || u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s)),
    );
  }, [users, q, roleFilter]);

  const count = (r: Role) => users.filter((u) => u.role === r).length;

  const showToast = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const setRole = async (id: string, role: Role) => {
    const targetUser = users.find((u) => u.id === id);
    if (!targetUser) return;

    if (targetUser.email.toLowerCase() === "vinaysiddha19@gmail.com") {
      showToast("Chapter Lead (vinaysiddha19@gmail.com) is permanently Admin");
      return;
    }

    // Optimistic UI update
    setUsers((us) => us.map((u) => (u.id === id ? { ...u, role } : u)));
    setSavingId(id);

    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, role }),
      });

      if (!res.ok) {
        throw new Error("Failed to update role");
      }
      showToast(`Updated ${targetUser.name}'s role to ${role}`);
    } catch (err) {
      console.error("Error setting role:", err);
      showToast("Failed to save role. Please try again.");
      // Rollback
      setUsers((us) => us.map((u) => (u.id === id ? { ...u, role: targetUser.role } : u)));
    } finally {
      setSavingId(null);
    }
  };

  const toggleSuspend = async (id: string) => {
    const targetUser = users.find((u) => u.id === id);
    if (!targetUser) return;

    if (targetUser.email.toLowerCase() === "vinaysiddha19@gmail.com") {
      showToast("Cannot suspend primary chapter lead");
      return;
    }

    const nextStatus: UserStatus = targetUser.status === "Suspended" ? "Active" : "Suspended";

    // Optimistic UI update
    setUsers((us) =>
      us.map((u) => (u.id === id ? { ...u, status: nextStatus } : u)),
    );
    setSavingId(id);

    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: nextStatus }),
      });

      if (!res.ok) {
        throw new Error("Failed to update status");
      }
      showToast(`Status changed to ${nextStatus}`);
    } catch (err) {
      console.error("Error toggling status:", err);
      showToast("Failed to update status. Please try again.");
      setUsers((us) => us.map((u) => (u.id === id ? { ...u, status: targetUser.status } : u)));
    } finally {
      setSavingId(null);
    }
  };

  const invite = async () => {
    if (!/^\S+@\S+\.\S+$/.test(inviteEmail)) return;
    const name = inviteEmail.split("@")[0];
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
    const newId = `u_${Date.now()}`;

    try {
      await fetch("/api/auth/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: newId,
          name: capitalizedName,
          email: inviteEmail,
        }),
      });

      // Save the desired role if not default Member
      if (inviteRole !== "Member") {
        await fetch("/api/users", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: newId, role: inviteRole }),
        });
      }
    } catch (e) {
      console.error("Failed to sync invited user:", e);
    }

    setUsers((us) => [
      ...us,
      {
        id: newId,
        name: capitalizedName,
        email: inviteEmail,
        role: inviteRole,
        status: "Active",
        lastActive: "Just invited",
        color: G.blue,
      },
    ]);
    showToast(`User ${inviteEmail} registered with role ${inviteRole}`);
    setInviteEmail("");
    setInviting(false);
  };

  return (
    <>
      <PageHeader
        title="Users & RBAC"
        description="Control roles and access permissions for chapter reviewers, leads, and members."
        actions={
          <div className="flex items-center gap-3">
            {feedback && (
              <span className="flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 border border-green-200">
                <Check className="size-3.5" />
                {feedback}
              </span>
            )}
            <button className={btnPrimary} onClick={() => setInviting(true)}>
              <Plus className="size-4" strokeWidth={2.6} />
              Invite user
            </button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Admins" value={count("Admin")} note={ROLE_NOTE.Admin} color={G.blue} />
        <StatCard label="Leads" value={count("Lead")} note={ROLE_NOTE.Lead} color={G.red} />
        <StatCard label="Reviewers" value={count("Reviewer")} note={ROLE_NOTE.Reviewer} color={G.yellow} />
        <StatCard label="Members" value={count("Member")} note={ROLE_NOTE.Member} color={G.green} />
      </div>

      <Card className="mt-4 overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
          <label className="relative min-w-[14rem] flex-1">
            <span className="sr-only">Search users</span>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name or email"
              className={cn(field, "w-full pl-10")}
            />
          </label>
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by role">
            {(["All", ...ROLES] as const).map((r) => {
              const active = roleFilter === r;
              return (
                <button
                  key={r}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setRoleFilter(r)}
                  className={cn(
                    "rounded-full border px-3.5 py-2 text-sm transition",
                    active
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground",
                  )}
                >
                  {r}
                </button>
              );
            })}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="px-6 py-3 font-medium">User</th>
                <th className="px-3 py-3 font-medium">Role (RBAC)</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3 font-medium">Last active</th>
                <th className="px-6 py-3 text-right font-medium">Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((u) => {
                const suspended = u.status === "Suspended";
                const isLeadAdmin = u.email.toLowerCase() === "vinaysiddha19@gmail.com";
                const isUpdating = savingId === u.id;

                return (
                  <tr key={u.id} className={cn("transition-colors hover:bg-background/50", suspended && "opacity-60")}>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar name={u.name} color={u.color} size={36} />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="truncate font-medium">{u.name}</p>
                            {isLeadAdmin && (
                              <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-semibold text-blue-800">
                                Chapter Lead
                              </span>
                            )}
                          </div>
                          <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="relative inline-flex items-center">
                        <select
                          value={u.role}
                          disabled={isLeadAdmin || isUpdating}
                          onChange={(e) => setRole(u.id, e.target.value as Role)}
                          aria-label={`Role for ${u.name}`}
                          className={cn(
                            field,
                            "py-2 font-medium cursor-pointer",
                            isLeadAdmin && "cursor-not-allowed bg-muted/40 font-semibold text-blue-600",
                          )}
                        >
                          {ROLES.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                        {isUpdating && (
                          <Loader2 className="absolute right-2 size-3.5 animate-spin text-muted-foreground" />
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3.5">
                      <span className="inline-flex items-center gap-2">
                        <span
                          className="size-2 rounded-full"
                          style={{ background: STATUS_COLOR[u.status] }}
                          aria-hidden="true"
                        />
                        {u.status}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 text-muted-foreground">{u.lastActive}</td>
                    <td className="px-6 py-3.5 text-right">
                      <button
                        role="switch"
                        disabled={isLeadAdmin || isUpdating}
                        aria-checked={!suspended}
                        aria-label={`${suspended ? "Restore" : "Suspend"} ${u.name}`}
                        onClick={() => toggleSuspend(u.id)}
                        className={cn(
                          "relative h-6 w-11 rounded-full border transition-colors",
                          isLeadAdmin ? "cursor-not-allowed opacity-50" : "cursor-pointer",
                          suspended ? "border-border bg-background" : "border-transparent bg-[#34A853]",
                        )}
                      >
                        <span
                          className={cn(
                            "absolute top-0.5 size-5 rounded-full bg-white transition-all",
                            suspended ? "left-0.5 bg-muted-foreground" : "left-[22px]",
                          )}
                        />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {rows.length === 0 && (
            <p className="px-6 py-14 text-center text-sm text-muted-foreground">
              {loading ? "Loading users from database..." : "No users match this search."}
            </p>
          )}
        </div>
      </Card>

      {/* Invite dialog */}
      {inviting && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Invite user"
          className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-6 backdrop-blur-sm"
          onClick={() => setInviting(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-medium tracking-tight">Invite a user</h2>
                <p className="mt-1 text-sm text-muted-foreground">Assign initial role and access.</p>
              </div>
              <button
                onClick={() => setInviting(false)}
                aria-label="Close"
                className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <label className="mt-6 block">
              <span className="mb-2 block text-sm font-medium">Email</span>
              <span className="relative block">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="name@svec.edu.in"
                  className={cn(field, "w-full pl-10")}
                />
              </span>
            </label>

            <label className="mt-4 block">
              <span className="mb-2 block text-sm font-medium">Role</span>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as Role)}
                className={cn(field, "w-full")}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r} — {ROLE_NOTE[r]}
                  </option>
                ))}
              </select>
            </label>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setInviting(false)}
                className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-background hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={invite}
                className={btnPrimary}
              >
                Add user
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
