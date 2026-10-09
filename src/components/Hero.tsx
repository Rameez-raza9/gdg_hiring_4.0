import EmailCapture from "./EmailCapture";
import StatsRow from "./StatsRow";
import Rating from "./Rating";
import IsoIllustration from "./IsoIllustration";
import { HERO_DESCRIPTION } from "@/lib/constants";

export default function Hero() {
  return (
    <section
      className="mx-auto min-h-[560px] max-w-[1040px] px-6 py-12 lg:px-[100px] lg:py-16 flex items-center"
      aria-label="Hero Section"
    >
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-8 w-full">
        {/* Left Column */}
        <div className="flex flex-col justify-center">
          <h1 className="text-[40px] sm:text-[52px] lg:text-[64px] font-medium leading-[1.05] tracking-[-0.04em] text-text-primary">
            Build.{" "}
            <span className="relative inline-block">
              Learn
              {/* Hand-drawn double squiggly SVG underline in black (stroke 2px) */}
              <svg
                className="absolute left-0 -bottom-2.5 w-full h-3 overflow-visible pointer-events-none"
                viewBox="0 0 100 12"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M1 3.5 Q 25 -0.5, 50 3.5 T 99 3.5"
                  stroke="#0A0A0A"
                  strokeWidth="2"
                  fill="transparent"
                  strokeLinecap="round"
                />
                <path
                  d="M2 8 Q 26 4, 51 8 T 98 8"
                  stroke="#0A0A0A"
                  strokeWidth="2"
                  fill="transparent"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            . <br />
            Grow together.
          </h1>

          <p className="mt-6 max-w-[420px] text-[16px] sm:text-[18px] leading-[1.6] text-text-secondary">
            {HERO_DESCRIPTION}
          </p>

          <div className="mt-8" id="join">
            <EmailCapture />
          </div>

          <StatsRow />

          <Rating />
        </div>

        {/* Right Column: Isometric Illustration */}
        <div className="flex justify-center items-center lg:justify-end scale-90 sm:scale-100">
          <IsoIllustration />
        </div>
      </div>
    </section>
  );
}
