import { Hero } from "@/components/site/Hero";
import { MealCard } from "@/components/site/MealCard";
import { Button } from "@/components/ui/Button";
import { getFeaturedMeals } from "@/lib/data/meals";

export default async function HomePage() {
  const featuredMeals = await getFeaturedMeals();

  return (
    <>
      <Hero />
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-heading text-2xl font-semibold text-espresso sm:text-3xl">
              Customer favorites
            </h2>
            <p className="mt-2 text-espresso-muted">
              A taste of what&apos;s cooking at Nududu by Dzie right now.
            </p>
          </div>
          <Button href="/menu" variant="secondary" className="hidden sm:inline-flex">
            View full menu
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredMeals.map((meal) => (
            <MealCard key={meal.id} meal={meal} />
          ))}
        </div>
        <div className="mt-8 flex justify-center sm:hidden">
          <Button href="/menu" variant="secondary">
            View full menu
          </Button>
        </div>
      </section>

      <section className="border-t border-sand bg-surface">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 md:grid-cols-3">
          <div>
            <h3 className="font-heading text-lg font-semibold text-espresso">
              Made to order
            </h3>
            <p className="mt-2 text-sm text-espresso-muted">
              Every dish is freshly prepared after you order &mdash; no shortcuts, just
              home cooking done right.
            </p>
          </div>
          <div>
            <h3 className="font-heading text-lg font-semibold text-espresso">
              Local &amp; continental
            </h3>
            <p className="mt-2 text-sm text-espresso-muted">
              From bold spicy Ghanaian classics to comforting continental favorites,
              there&apos;s something for every craving.
            </p>
          </div>
          <div>
            <h3 className="font-heading text-lg font-semibold text-espresso">
              Pickup or delivery
            </h3>
            <p className="mt-2 text-sm text-espresso-muted">
              Place your order online and choose to pick it up or have it delivered
              &mdash; pay on pickup or delivery.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
