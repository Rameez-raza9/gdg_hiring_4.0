"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShieldAlert, LogIn, ArrowLeft, Send, CheckCircle2, Loader2 } from "lucide-react";
import { btnPrimary } from "./ui";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>("Admin");

  // Request admin state
  const [requestSent, setRequestSent] = useState(false);
  const [sendingRequest, setSendingRequest] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [requestRole, setRequestRole] = useState("Reviewer");
  const [requestReason, setRequestReason] = useState("");

  useEffect(() => {
    // Read cache on client mount without causing SSR hydration mismatch
    const cachedAuth = sessionStorage.getItem("gdg_admin_authorized");
    const cachedEmail = sessionStorage.getItem("gdg_admin_email");
    const cachedName = sessionStorage.getItem("gdg_admin_name");
    const cachedRole = sessionStorage.getItem("gdg_admin_role");

    if (cachedEmail) setUserEmail(cachedEmail);
    if (cachedName) setUserName(cachedName);
    if (cachedRole) setUserRole(cachedRole);

    if (cachedAuth === "true" && cachedEmail && cachedRole !== "Member") {
      setAuthorized(true);
      setChecking(false);
      return;
    }

    if (!cachedEmail || cachedRole === "Member") {
      setAuthorized(false);
      setChecking(false);
      return;
    }

    // Verify against Turso database
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        const cleanEmail = cachedEmail.trim().toLowerCase();
        if (cleanEmail === "vinaysiddha19@gmail.com") {
          setAuthorized(true);
          sessionStorage.setItem("gdg_admin_authorized", "true");
          return;
        }

        const found = data.users?.find(
          (u: { email: string }) => u.email.toLowerCase() === cleanEmail
        );

        if (
          found &&
          ["Admin", "Lead", "Reviewer"].includes(found.role) &&
          found.status === "Active"
        ) {
          setAuthorized(true);
          sessionStorage.setItem("gdg_admin_authorized", "true");
          sessionStorage.setItem("gdg_admin_name", found.name);
          sessionStorage.setItem("gdg_admin_role", found.role);
          if (found.photo_url) sessionStorage.setItem("gdg_admin_photo", found.photo_url);
        } else {
          setAuthorized(false);
          sessionStorage.removeItem("gdg_admin_authorized");
        }
      })
      .catch(() => {
        setAuthorized(false);
      })
      .finally(() => {
        setChecking(false);
      });
  }, []);

  const handleSendAdminRequest = async () => {
    if (!userEmail) return;
    setSendingRequest(true);
    setRequestError(null);
    try {
      const res = await fetch("/api/auth/request-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          name: userName || userEmail.split("@")[0],
          requestedRole: requestRole,
          reason: requestReason.trim(),
        }),
      });

      if (res.ok) {
        setRequestSent(true);
      } else {
        const d = await res.json().catch(() => null);
        setRequestError(d?.error || "Failed to submit request. Please try again.");
      }
    } catch (err) {
      console.error("Failed to send admin request:", err);
      setRequestError("Network error. Could not send request.");
    } finally {
      setSendingRequest(false);
    }
  };

  if (checking) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center smooth-fade-in">
        <div className="relative mb-6 flex items-center justify-center">
          <div className="size-16 rounded-2xl border border-border bg-card p-3 shadow-sm flex items-center justify-center">
            <img src="/assets/logos/main_logo.jpeg" alt="GDGoC" className="size-10 object-contain rounded-lg" />
          </div>
          <div className="absolute -bottom-1 -right-1 flex gap-1">
            <span className="size-2 rounded-full bg-[#4285F4] animate-ping" />
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Loader2 className="size-4 animate-spin text-[#4285F4]" />
          <span>Verifying authorization...</span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">Securing GDGoC SVEC Admin Portal</p>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12 smooth-fade-in">
        <div className="max-w-md w-full rounded-3xl border border-border bg-card p-8 text-center shadow-lg">
          <div className="size-14 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center border border-amber-200 mb-4">
            <ShieldAlert className="size-8" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Admin Access Restricted</h2>
          <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
            {userEmail ? (
              <>
                You are currently signed in as <strong>{userEmail}</strong> (Member role). Only authorized reviewers, track leads, and chapter admins can access recruitment pipelines.
              </>
            ) : (
              <>Please sign in to access the recruitment and attendance controls.</>
            )}
          </p>

          {userEmail && (
            <div className="mt-6 rounded-2xl border border-border bg-background p-4 text-left">
              {requestSent ? (
                <div className="flex flex-col items-center justify-center py-3 text-center space-y-2">
                  <CheckCircle2 className="size-8 text-green-600" />
                  <p className="text-sm font-semibold text-foreground">Request Sent to Vinay Siddha!</p>
                  <p className="text-xs text-muted-foreground max-w-xs">
                    Your request has been delivered to <code>vinaysiddha19@gmail.com</code>. Once your role is upgraded to Reviewer or Lead, you can access this portal immediately.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    Request Elevated Access
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Send a role authorization request directly to chapter lead Vinay Siddha:
                  </p>
                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                      Requested Role
                    </label>
                    <select
                      value={requestRole}
                      onChange={(e) => setRequestRole(e.target.value)}
                      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs outline-none text-foreground font-medium"
                    >
                      <option value="Reviewer">Reviewer (Score & comment on applicants)</option>
                      <option value="Lead">Track Lead (Manage track pipelines)</option>
                      <option value="Admin">Admin (Full administrative access)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                      Reason / Responsibilities (optional)
                    </label>
                    <input
                      type="text"
                      value={requestReason}
                      onChange={(e) => setRequestReason(e.target.value)}
                      placeholder="e.g. Assigned to review Web & App applicants"
                      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs outline-none text-foreground"
                    />
                  </div>
                  {requestError && (
                    <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-2.5 text-[11px] text-red-400 font-medium text-center">
                      {requestError}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleSendAdminRequest}
                    disabled={sendingRequest}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary text-white py-2 text-xs font-semibold transition hover:brightness-105 cursor-pointer disabled:opacity-60"
                  >
                    {sendingRequest ? (
                      <>
                        <Loader2 className="size-3.5 animate-spin" /> Sending to vinaysiddha19@gmail.com...
                      </>
                    ) : (
                      <>
                        <Send className="size-3.5" /> Send Request Email to Vinay
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 flex flex-col gap-2.5">
            {!userEmail && (
              <Link
                href="/login"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary text-white py-2.5 text-sm font-semibold transition hover:brightness-105"
              >
                <LogIn className="size-4" /> Sign In with Google
              </Link>
            )}
            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-border bg-background text-foreground py-2.5 text-sm font-medium transition hover:bg-slate-50"
            >
              <ArrowLeft className="size-4" /> Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Role-Based Access Control (RBAC) route restrictions
  if (userRole === "Reviewer") {
    // If on /admin overview, seamlessly redirect to applications
    if (pathname === "/admin") {
      router.replace("/admin/applications");
      return null;
    }

    const isAppPath = pathname.startsWith("/admin/applications");
    const isUsersPath = pathname === "/admin/users";

    if (!isAppPath && !isUsersPath) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
          <div className="size-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4">
            <ShieldAlert className="size-8" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Reviewer Access Restricted</h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md leading-relaxed">
            As a Reviewer, you only have access to Candidate Applications and your own profile details.
          </p>
          <Link
            href="/admin/applications"
            className="mt-5 rounded-xl bg-[#4285F4] px-5 py-2.5 text-xs font-semibold text-white transition hover:brightness-110"
          >
            Go to Applications
          </Link>
        </div>
      );
    }
  }

  if (userRole === "Lead") {
    // Lead has access to analytics, overview, applications, reviews, interview plan, attendance
    // Restrict broadcast
    if (pathname === "/admin/broadcast") {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
          <div className="size-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4">
            <ShieldAlert className="size-8" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Admin Only Feature</h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md leading-relaxed">
            Broadcast emails are restricted to Chapter Administrators.
          </p>
          <Link
            href="/admin/analytics"
            className="mt-5 rounded-xl bg-[#4285F4] px-5 py-2.5 text-xs font-semibold text-white transition hover:brightness-110"
          >
            Go to Analytics
          </Link>
        </div>
      );
    }
  }

  return <>{children}</>;
}
