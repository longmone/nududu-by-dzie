import type { SpiceLevel } from "@/types/meal";
import { cn } from "@/lib/utils";

const LABELS: Record<SpiceLevel, string> = {
  0: "Not Spicy",
  1: "Mild",
  2: "Medium",
  3: "Spicy",
  4: "Extra Hot",
};

function PepperIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("h-3.5 w-3.5", active ? "text-paprika" : "text-sand")}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M14.5 3c.4-.6 1.1-1 1.9-1 .6 0 1 .5.9 1.1-.2.9-.8 1.6-1.6 2C17.9 5.6 19.5 8 19.5 11c0 5-4 10-8.5 10S2.5 16 2.5 12.5C2.5 9 5 7 8 7c1 0 1.6.3 2.3.7-1-1.4-1-3.2.2-4.4.5-.5 1.3-.6 1.9-.2.5.4.6 1.1.1 1.7-.3.4-.4.9-.2 1.4.4-1.2 1.2-2.4 2.2-3.2Z" />
    </svg>
  );
}

export function SpiceLevelBadge({
  level,
  className,
}: {
  level: SpiceLevel;
  className?: string;
}) {
  return (
    <div
      className={cn("inline-flex items-center gap-1.5", className)}
      title={LABELS[level]}
      aria-label={`Spice level: ${LABELS[level]}`}
    >
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4].map((step) => (
          <PepperIcon key={step} active={step <= level} />
        ))}
      </div>
      <span className="text-xs font-medium text-espresso-muted">{LABELS[level]}</span>
    </div>
  );
}
