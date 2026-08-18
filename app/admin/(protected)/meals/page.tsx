import Link from "next/link";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DeleteMealButton } from "@/components/admin/DeleteMealButton";
import { getAllMealsAdmin } from "@/lib/data/meals";
import { formatGHS } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Meals | Nududu by Dzie Admin",
};

export default async function AdminMealsPage() {
  const meals = await getAllMealsAdmin();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-espresso">Meals</h1>
          <p className="mt-1 text-sm text-espresso-muted">Manage what&apos;s on the menu.</p>
        </div>
        <Button href="/admin/meals/new" variant="primary">
          + Add meal
        </Button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-sand bg-surface">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-sand text-xs uppercase tracking-wide text-espresso-muted">
            <tr>
              <th className="px-4 py-3">Meal</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand">
            {meals.map((meal) => {
              const soldOut = !meal.isAvailable || meal.quantityAvailable <= 0;
              return (
                <tr key={meal.id}>
                  <td className="px-4 py-3">
                    <div className="font-medium text-espresso">{meal.name}</div>
                    {meal.isFeatured && (
                      <Badge tone="turmeric" className="mt-1">
                        Featured
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-espresso-muted">{formatGHS(meal.price)}</td>
                  <td className="px-4 py-3 text-espresso-muted">{meal.quantityAvailable}</td>
                  <td className="px-4 py-3">
                    <Badge tone={soldOut ? "brick" : "sage"}>{soldOut ? "Sold out" : "Available"}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/meals/${meal.id}/edit`}
                        className="text-xs font-medium text-paprika hover:underline"
                      >
                        Edit
                      </Link>
                      <DeleteMealButton mealId={meal.id} mealName={meal.name} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {meals.length === 0 && (
          <p className="p-6 text-center text-sm text-espresso-muted">
            No meals yet. Add your first one to get started.
          </p>
        )}
      </div>
    </div>
  );
}
