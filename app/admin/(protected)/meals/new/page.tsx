import type { Metadata } from "next";
import { AdminMealForm } from "@/components/admin/AdminMealForm";
import { createMealAction } from "@/app/admin/(protected)/meals/actions";
import { getCategories } from "@/lib/data/categories";

export const metadata: Metadata = {
  title: "Add Meal | Nududu by Dzie Admin",
};

export default async function NewMealPage() {
  const categories = await getCategories();

  return (
    <div className="max-w-2xl">
      <h1 className="font-heading text-2xl font-semibold text-espresso">Add a meal</h1>
      <p className="mt-1 text-sm text-espresso-muted">
        Fill in the details below — this will appear on the public menu right away.
      </p>
      <div className="mt-6">
        <AdminMealForm categories={categories} action={createMealAction} />
      </div>
    </div>
  );
}
