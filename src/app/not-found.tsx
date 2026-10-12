import Link from "next/link";
import { ArrowLeft, Home, Sparkles, Shield, Compass, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-primary/20 relative overflow-hidden">
      {/* Background ambient Google brand glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[500px] rounded-full bg-[#4285F4]/10 blur-[120px]" />
        <div className="absolute top-1/3 left-1/3 size-[350px] rounded-full bg-[#EA4335]/10 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/3 size-[400px] rounded-full bg-[#34A853]/10 blur-[110px]" />
      </div>

      {/* Header bar */}
      <header className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 transition hover:opacity-85">
          <img
            src="/assets/logos/main_logo.jpeg"
            alt="GDGoC SVEC"
            className="size-8 rounded-xl object-contain border border-border shadow-sm"
          />
          <span className="font-bold text-sm tracking-tight text-foreground">GDGoC SVEC</span>
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition rounded-full border border-border px-3.5 py-1.5 bg-card/60"
        >
          <Home className="size-3.5" />
          <span>Home</span>
        </Link>
      </header>

      {/* Central 404 Hero */}
      <div className="w-full max-w-2xl mx-auto px-6 py-12 text-center flex flex-col items-center my-auto">
        {/* Animated mascot & GDG Quad dots */}
        <div className="relative mb-6">
          <div className="size-28 rounded-3xl border border-border bg-card/80 p-4 shadow-xl backdrop-blur-md flex items-center justify-center">
            <img
              src="/assets/gifs/dot-2.gif"
              alt="GDG Dot Mascot"
              className="size-20 object-contain drop-shadow"
            />
          </div>
          {/* Google colors floating pill */}
          <div className="absolute -bottom-2 -right-2 flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 shadow-md">
            <span className="size-2 rounded-full bg-[#4285F4] animate-pulse" />
            <span className="size-2 rounded-full bg-[#EA4335] animate-pulse delay-75" />
            <span className="size-2 rounded-full bg-[#FBBC04] animate-pulse delay-150" />
            <span className="size-2 rounded-full bg-[#34A853] animate-pulse delay-200" />
          </div>
        </div>

        {/* 404 Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary mb-4">
          <Compass className="size-3.5" />
          <span>Error 404 &bull; Page Not Found</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
          Lost in cyberspace?
        </h1>

        <p className="mt-3.5 text-base text-muted-foreground max-w-md leading-relaxed">
          The page or route you were looking for doesn&apos;t exist, was moved, or had its URL updated.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 w-full">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-105 active:scale-95"
          >
            <Home className="size-4" />
            <span>Return to Home</span>
          </Link>

          <Link
            href="/apply"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-muted/50 active:scale-95"
          >
            <Sparkles className="size-4 text-[#FBBC04]" />
            <span>Apply for Core Team</span>
          </Link>

          <Link
            href="/admin"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-muted/50 active:scale-95"
          >
            <Shield className="size-4 text-[#4285F4]" />
            <span>Admin Portal</span>
          </Link>
        </div>

        {/* Helpful links card */}
        <div className="mt-12 w-full rounded-2xl border border-border bg-card/60 p-4 text-xs text-muted-foreground backdrop-blur-sm">
          <p className="flex items-center justify-center gap-1.5">
            <Search className="size-3.5 text-muted-foreground" />
            <span>Looking for something specific? Contact Chapter Lead at</span>
            <a
              href="mailto:vinaysiddha19@gmail.com"
              className="text-primary font-medium hover:underline ml-1"
            >
              vinaysiddha19@gmail.com
            </a>
          </p>
        </div>
      </div>

      {/* Footer wave & branding */}
      <footer className="w-full border-t border-border/40 py-6 text-center text-xs text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Google Developer Groups on Campus &bull; Sri Vasavi Engineering College</p>
      </footer>
    </main>
  );
}
