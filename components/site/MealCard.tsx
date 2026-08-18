import Image from "next/image";
import Link from "next/link";
import type { Meal } from "@/types/meal";
import { formatGHS } from "@/lib/utils";
import { SpiceLevelBadge } from "@/components/site/SpiceLevelBadge";
import { Badge } from "@/components/ui/Badge";

export function MealCard({ meal }: { meal: Meal }) {
  const startingPrice = Math.min(...meal.sizes.map((s) => s.price), meal.price);
  const soldOut = !meal.isAvailable || meal.quantityAvailable <= 0;

  return (
    <Link
      href={`/menu/${meal.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-sand bg-surface transition-shadow hover:shadow-lg hover:shadow-espresso/5"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-sand">
        <Image
          src={meal.image}
          alt={meal.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {soldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-espresso/50">
            <Badge tone="brick">Sold out</Badge>
          </div>
        )}
        <Badge
          tone="sand"
          className="absolute left-3 top-3 bg-surface/90 capitalize backdrop-blur-sm"
        >
          {meal.category}
        </Badge>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-heading text-lg font-semibold text-espresso">{meal.name}</h3>
        <p className="line-clamp-2 text-sm text-espresso-muted">{meal.description}</p>
        <div className="mt-auto flex flex-col gap-2 pt-2">
          <SpiceLevelBadge level={meal.spiceLevel} />
          <span className="font-heading text-base font-semibold text-paprika">
            from {formatGHS(startingPrice)}
          </span>
        </div>
      </div>
    </Link>
  );
}
