"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import { ShieldAlert, LogIn, ArrowLeft } from "lucide-react";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUserEmail(user?.email || null);
      if (user?.email && user.email.trim().toLowerCase() === "vinaysiddha19@gmail.com") {
        setAuthorized(true);
      } else {
        setAuthorized(false);
      }
      setChecking(false);
    });
    return () => unsub();
  }, []);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-muted-foreground text-sm font-medium">
        Verifying admin authorization...
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-6">
        <div className="max-w-md w-full rounded-3xl border border-border bg-card p-8 text-center shadow-lg">
          <div className="size-14 rounded-2xl bg-red-50 text-red-600 mx-auto flex items-center justify-center border border-red-100 mb-4">
            <ShieldAlert className="size-8" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Admin Access Restricted</h2>
          <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
            {userEmail ? (
              <>
                You are currently signed in as <strong>{userEmail}</strong> (Member). Only the chapter lead (<code>vinaysiddha19@gmail.com</code>) is authorized to access the admin portal.
              </>
            ) : (
              <>Please sign in as the chapter lead (<code>vinaysiddha19@gmail.com</code>) to access the recruitment and attendance controls.</>
            )}
          </p>
          <div className="mt-6 flex flex-col gap-2.5">
            <Link
              href="/login"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary text-white py-2.5 text-sm font-semibold transition hover:brightness-105"
            >
              <LogIn className="size-4" /> Sign In with Admin Account
            </Link>
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

  return <>{children}</>;
}
