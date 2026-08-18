import Link from "next/link";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { value: undefined, label: "All" },
  { value: "local", label: "Local" },
  { value: "continental", label: "Continental" },
] as const;

export function CategoryFilter({ active }: { active?: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((option) => {
        const isActive = active === option.value;
        return (
          <Link
            key={option.label}
            href={option.value ? `/menu?category=${option.value}` : "/menu"}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
              isActive
                ? "border-paprika bg-paprika text-white"
                : "border-sand bg-surface text-espresso-muted hover:border-paprika hover:text-paprika"
            )}
          >
            {option.label}
          </Link>
        );
      })}
    </div>
  );
}
