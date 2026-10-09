import { Star } from "lucide-react";
import { AVERAGE_RATING, RATING_TEXT } from "@/lib/constants";

/** Half-filled star via clip-path overlay */
function HalfStar({ size }: { size: number }) {
  return (
    <span className="relative inline-block" style={{ width: size, height: size }}>
      {/* Empty outline */}
      <Star
        size={size}
        className="absolute inset-0 text-text-primary"
        aria-hidden="true"
      />
      {/* Filled left half */}
      <span className="absolute inset-0 w-1/2 overflow-hidden">
        <Star
          size={size}
          className="fill-text-primary text-text-primary"
          aria-hidden="true"
        />
      </span>
    </span>
  );
}

export default function Rating() {
  const fullStars = Math.floor(AVERAGE_RATING);
  const hasHalf = AVERAGE_RATING % 1 !== 0;

  return (
    <div
      className="mt-4 flex items-center gap-2"
      role="img"
      aria-label={`${AVERAGE_RATING} out of 5 stars — ${RATING_TEXT}`}
    >
      <div className="flex items-center gap-0.5">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star
            key={i}
            size={16}
            className="fill-text-primary text-text-primary"
            aria-hidden="true"
          />
        ))}
        {hasHalf && <HalfStar size={16} />}
      </div>

      <span className="text-[14px] font-medium text-text-primary">
        {AVERAGE_RATING}
      </span>
      <span className="text-[14px] text-text-secondary">{RATING_TEXT}</span>
    </div>
  );
}
