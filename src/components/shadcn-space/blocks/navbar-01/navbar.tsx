"use client";

import GDGLogo from "@/assets/logo/logo";
import { cn } from "@/lib/utils";
import { TextAlignJustify } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import HiringApplicationModal from "@/components/HiringApplicationModal";
import { LoginModal } from "@/components/LoginModal";
import DropdownMenu11 from "@/components/DropdownMenu11";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type NavigationSection = {
  title: string;
  href: string;
};

const navigationData: NavigationSection[] = [
  {
    title: "About Wings",
    href: "#wings",
  },
  {
    title: "Tracks",
    href: "#tracks",
  },
  {
    title: "Stats",
    href: "#stats",
  },
  {
    title: "Recruitment",
    href: "#apply",
  },
  {
    title: "FAQs",
    href: "#faqs",
  },
];

const Navbar = () => {
  const [sticky, setSticky] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleScroll = useCallback(() => {
    setSticky(window.scrollY >= 50);
  }, []);

  const handleResize = useCallback(() => {
    if (window.innerWidth >= 768) setIsOpen(false);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [handleScroll, handleResize]);

  return (
    <div className="sticky top-0 z-50 w-full transition-all duration-500">
      <header className="w-full">
        <div className="max-w-7xl mx-auto w-full px-4 py-3 sm:px-6">
          <nav
            className={cn(
              "w-full flex items-center h-fit justify-between gap-3.5 lg:gap-6 transition-all duration-500 px-4 py-2.5",
              sticky
                ? "bg-neutral-950/70 backdrop-blur-2xl border border-neutral-800/80 shadow-2xl shadow-black/40 rounded-full"
                : "bg-neutral-950/40 backdrop-blur-md border border-neutral-900/60 rounded-full"
            )}
          >
            {/* GDG Logo */}
            <a href="/" className="flex items-center gap-2">
              <GDGLogo />
            </a>

            {/* Clean Flat Navigation Links */}
            <div className="hidden lg:flex items-center gap-1">
              {navigationData.map((navItem) => (
                <a
                  key={navItem.title}
                  href={navItem.href}
                  className="px-3.5 py-1.5 text-xs font-medium rounded-full text-neutral-400 hover:text-white hover:bg-neutral-900 transition-all tracking-normal"
                >
                  {navItem.title}
                </a>
              ))}
            </div>

            {/* Right Action CTAs: DropdownMenu11 Language selector, Login & Apply Now */}
            <div className="hidden lg:flex items-center gap-3">
              <DropdownMenu11 />
              <LoginModal />
              <HiringApplicationModal />
            </div>

            {/* Mobile Actions & Dropdown */}
            <div className="lg:hidden flex items-center gap-2">
              <LoginModal />
              <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger className="rounded-full bg-neutral-900 border border-neutral-800 p-2 text-neutral-300 outline-none flex items-center justify-center cursor-pointer transition-colors hover:text-white hover:bg-neutral-800">
                  <TextAlignJustify size={18} />
                  <span className="sr-only">Menu</span>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-64 mt-2 border-neutral-800 bg-neutral-950/95 backdrop-blur-xl p-2"
                >
                  <div className="pb-2 border-b border-neutral-800">
                    <DropdownMenu11 />
                  </div>
                  {navigationData.map((item) => (
                    <DropdownMenuItem key={item.title}>
                      <a
                        href={item.href}
                        className="w-full cursor-pointer text-xs font-medium text-neutral-300 hover:text-white"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.title}
                      </a>
                    </DropdownMenuItem>
                  ))}
                  <div className="pt-2 px-1">
                    <HiringApplicationModal />
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </nav>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
