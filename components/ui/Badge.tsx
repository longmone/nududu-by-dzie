import { cn } from "@/lib/utils";

type BadgeTone = "turmeric" | "sage" | "brick" | "sand";

const toneClasses: Record<BadgeTone, string> = {
  turmeric: "bg-turmeric text-espresso",
  sage: "bg-sage text-white",
  brick: "bg-brick text-white",
  sand: "bg-sand text-espresso",
};

export function Badge({
  tone = "sand",
  className,
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
