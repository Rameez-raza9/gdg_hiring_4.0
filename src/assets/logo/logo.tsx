import Image from "next/image";
import type { HTMLAttributes } from "react";

interface LogoProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  size?: number;
}

const Logo = ({ className = "", size = 36, ...props }: LogoProps) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`} {...props}>
      <div className="relative h-9 w-9 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 shadow-sm flex items-center justify-center">
        <Image
          src="/logo.jpeg"
          alt="GDGoC SVEC Logo"
          width={size}
          height={size}
          className="object-cover h-full w-full"
          priority
        />
      </div>
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1">
          <span className="text-sm font-bold tracking-tight text-white">
            GDGoC SVEC
          </span>
          <span className="flex gap-1 items-center ml-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4285F4]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#EA4335]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#FBBC04]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#34A853]" />
          </span>
        </div>
        <span className="text-[10px] text-neutral-400 leading-none">
          Campus Chapter
        </span>
      </div>
    </div>
  );
};

export default Logo;
