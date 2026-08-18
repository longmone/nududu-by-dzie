import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AdminMealForm } from "@/components/admin/AdminMealForm";
import { updateMealAction } from "@/app/admin/(protected)/meals/actions";
import { getCategories } from "@/lib/data/categories";
import { getMealById } from "@/lib/data/meals";

export const metadata: Metadata = {
  title: "Edit Meal | Nududu by Dzie Admin",
};

export default async function EditMealPage({
  params,
}: {
  params: Promise<{ mealId: string }>;
}) {
  const { mealId } = await params;
  const [meal, categories] = await Promise.all([getMealById(mealId), getCategories()]);

  if (!meal) notFound();

  return (
    <div className="max-w-2xl">
      <h1 className="font-heading text-2xl font-semibold text-espresso">Edit {meal.name}</h1>
      <p className="mt-1 text-sm text-espresso-muted">Changes appear on the public menu right away.</p>
      <div className="mt-6">
        <AdminMealForm categories={categories} meal={meal} action={updateMealAction.bind(null, meal.id)} />
      </div>
    </div>
  );
}
