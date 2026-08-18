import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SpiceLevelBadge } from "@/components/site/SpiceLevelBadge";
import { Badge } from "@/components/ui/Badge";
import { OrderForm } from "@/components/site/OrderForm";
import { getMealBySlug } from "@/lib/data/meals";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ mealSlug: string }>;
}): Promise<Metadata> {
  const { mealSlug } = await params;
  const meal = await getMealBySlug(mealSlug);
  if (!meal) return { title: "Meal not found | Nududu by Dzie" };
  return {
    title: `${meal.name} | Nududu by Dzie`,
    description: meal.description,
  };
}

export default async function MealDetailPage({
  params,
}: {
  params: Promise<{ mealSlug: string }>;
}) {
  const { mealSlug } = await params;
  const meal = await getMealBySlug(mealSlug);

  if (!meal) notFound();

  const soldOut = !meal.isAvailable || meal.quantityAvailable <= 0;

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-sand">
            <Image
              src={meal.image}
              alt={meal.name}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
              priority
            />
          </div>
          <Badge tone="sand" className="w-fit capitalize">
            {meal.category}
          </Badge>
          <h1 className="font-heading text-3xl font-semibold text-espresso">
            {meal.name}
          </h1>
          <SpiceLevelBadge level={meal.spiceLevel} />
          <p className="text-espresso-muted">{meal.description}</p>
          {!soldOut && (
            <p className="text-sm font-medium text-espresso-muted">
              {meal.quantityAvailable} available today
            </p>
          )}
        </div>

        <div>
          <OrderForm meal={meal} />
        </div>
      </div>
    </section>
  );
}
