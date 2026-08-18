import type { Metadata } from "next";
import { CategoryFilter } from "@/components/site/CategoryFilter";
import { MealCard } from "@/components/site/MealCard";
import { getMeals } from "@/lib/data/meals";
import type { MealCategory } from "@/types/meal";

export const metadata: Metadata = {
  title: "Menu | Nududu by Dzie",
  description:
    "Browse the full Nududu by Dzie menu — spicy jollof, spicy chicken, spicy gizzard, banku with okro soup, and continental favorites.",
};

function isMealCategory(value: string | undefined): value is MealCategory {
  return value === "local" || value === "continental";
}

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const activeCategory = isMealCategory(category) ? category : undefined;
  const meals = await getMeals(activeCategory);

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-semibold text-espresso sm:text-4xl">
          Our Menu
        </h1>
        <p className="mt-2 max-w-2xl text-espresso-muted">
          Every meal is prepared fresh to order. Pick a dish, choose your size, and
          we&apos;ll get it ready for pickup or delivery.
        </p>
      </div>

      <div className="mb-8">
        <CategoryFilter active={activeCategory} />
      </div>

      {meals.length === 0 ? (
        <p className="text-espresso-muted">No meals found in this category yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {meals.map((meal) => (
            <MealCard key={meal.id} meal={meal} />
          ))}
        </div>
      )}
    </section>
  );
}
