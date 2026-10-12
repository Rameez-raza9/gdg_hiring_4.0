"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Avatar } from "@/components/admin/ui";

interface AdminUserState {
  name: string;
  email: string;
  photoUrl: string | null;
  role: string;
}

export function AdminUserProfile() {
  const router = useRouter();
  const [userState, setUserState] = useState<AdminUserState>({
    name: "Admin User",
    email: "",
    photoUrl: null,
    role: "Admin",
  });
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const cachedName = sessionStorage.getItem("gdg_admin_name");
    const cachedEmail = sessionStorage.getItem("gdg_admin_email");
    const cachedPhoto = sessionStorage.getItem("gdg_admin_photo");
    const cachedRole = sessionStorage.getItem("gdg_admin_role");

    if (cachedEmail) {
      setUserState({
        name: cachedName || cachedEmail.split("@")[0],
        email: cachedEmail,
        photoUrl: cachedPhoto || null,
        role: cachedRole || (cachedEmail.toLowerCase() === "vinaysiddha19@gmail.com" ? "Lead Admin" : "Reviewer"),
      });
    }
  }, []);

  const handleLogout = () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      sessionStorage.removeItem("gdg_admin_authorized");
      sessionStorage.removeItem("gdg_admin_id");
      sessionStorage.removeItem("gdg_admin_email");
      sessionStorage.removeItem("gdg_admin_name");
      sessionStorage.removeItem("gdg_admin_photo");
      sessionStorage.removeItem("gdg_admin_role");
      router.push("/login");
    } catch (e) {
      console.error("Sign out error:", e);
      setLoggingOut(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-2.5 rounded-xl border border-border bg-background p-2.5 transition">
      <div className="flex min-w-0 items-center gap-2.5">
        {userState.photoUrl ? (
          <img
            src={userState.photoUrl}
            alt={userState.name}
            className="size-8 rounded-lg object-cover border border-border"
            referrerPolicy="no-referrer"
          />
        ) : (
          <Avatar name={userState.name} size={32} />
        )}
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-foreground">
            {userState.name}
          </p>
          <p className="truncate text-[11px] text-muted-foreground">
            {userState.role} · {userState.email.slice(0, 16)}...
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        disabled={loggingOut}
        title="Sign out of Admin Portal"
        aria-label="Sign out"
        className="grid size-7 shrink-0 place-items-center rounded-lg border border-transparent text-muted-foreground transition hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive cursor-pointer disabled:opacity-50"
      >
        <LogOut className="size-3.5" />
      </button>
    </div>
  );
}

export function AdminUserHeaderPill() {
  const [userState, setUserState] = useState<AdminUserState>({
    name: "Admin",
    email: "",
    photoUrl: null,
    role: "Admin",
  });

  useEffect(() => {
    const cachedName = sessionStorage.getItem("gdg_admin_name");
    const cachedEmail = sessionStorage.getItem("gdg_admin_email");
    const cachedPhoto = sessionStorage.getItem("gdg_admin_photo");
    const cachedRole = sessionStorage.getItem("gdg_admin_role");

    if (cachedEmail) {
      setUserState({
        name: cachedName || cachedEmail.split("@")[0],
        email: cachedEmail,
        photoUrl: cachedPhoto || null,
        role: cachedRole || (cachedEmail.toLowerCase() === "vinaysiddha19@gmail.com" ? "Lead" : "Reviewer"),
      });
    }
  }, []);

  return (
    <div className="flex items-center gap-2 rounded-xl border border-border/80 bg-card px-2.5 py-1.5 text-xs">
      {userState.photoUrl ? (
        <img
          src={userState.photoUrl}
          alt={userState.name}
          className="size-5 rounded-full object-cover border border-border"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="size-5 rounded-full bg-[#4285F4] text-white flex items-center justify-center text-[10px] font-bold">
          {userState.name[0]?.toUpperCase() || "A"}
        </div>
      )}
      <span className="max-w-[120px] truncate font-medium text-foreground hidden sm:inline">
        {userState.name}
      </span>
      <span className="rounded-full bg-secondary px-1.5 py-0.2 text-[10px] font-semibold text-secondary-foreground">
        {userState.role}
      </span>
    </div>
  );
}
