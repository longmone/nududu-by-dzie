"use client";

import { useActionState, useState } from "react";
import type { MealFormState } from "@/app/admin/(protected)/meals/actions";
import { Button } from "@/components/ui/Button";
import { ImageUploader } from "@/components/admin/ImageUploader";
import type { Category } from "@/lib/data/categories";
import type { AdminMeal } from "@/lib/data/meals";

const SPICE_LEVELS = [
  { value: 0, label: "0 — Not Spicy" },
  { value: 1, label: "1 — Mild" },
  { value: 2, label: "2 — Medium" },
  { value: 3, label: "3 — Spicy" },
  { value: 4, label: "4 — Extra Hot" },
];

const inputClasses =
  "mt-2 w-full rounded-lg border border-sand bg-cream px-3 py-2 text-sm text-espresso outline-none focus:border-paprika";

type SizeRow = { label: string; price: string };

const initialState: MealFormState = undefined;

export function AdminMealForm({
  categories,
  meal,
  action,
}: {
  categories: Category[];
  meal?: AdminMeal;
  action: (state: MealFormState, formData: FormData) => Promise<MealFormState>;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [sizes, setSizes] = useState<SizeRow[]>(
    meal && meal.sizes.length > 0
      ? meal.sizes.map((s) => ({ label: s.label, price: String(s.price) }))
      : [{ label: "Regular", price: "" }]
  );

  function updateSize(index: number, field: keyof SizeRow, value: string) {
    setSizes((rows) => rows.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  }

  function addSize() {
    setSizes((rows) => [...rows, { label: "", price: "" }]);
  }

  function removeSize(index: number) {
    setSizes((rows) => rows.filter((_, i) => i !== index));
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <input
        type="hidden"
        name="sizes"
        value={JSON.stringify(sizes.filter((s) => s.label.trim() && s.price !== ""))}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-sm font-semibold text-espresso">
            Meal name
          </label>
          <input id="name" name="name" defaultValue={meal?.name} className={inputClasses} />
          {state?.errors?.name && <p className="mt-1 text-xs text-brick">{state.errors.name[0]}</p>}
        </div>
        <div>
          <label htmlFor="categoryId" className="text-sm font-semibold text-espresso">
            Category
          </label>
          <select
            id="categoryId"
            name="categoryId"
            defaultValue={meal?.categoryId ?? categories[0]?.id}
            className={inputClasses}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {state?.errors?.categoryId && <p className="mt-1 text-xs text-brick">{state.errors.categoryId[0]}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="description" className="text-sm font-semibold text-espresso">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={meal?.description}
          className={inputClasses}
        />
        {state?.errors?.description && <p className="mt-1 text-xs text-brick">{state.errors.description[0]}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="spiceLevel" className="text-sm font-semibold text-espresso">
            Spice level
          </label>
          <select
            id="spiceLevel"
            name="spiceLevel"
            defaultValue={meal?.spiceLevel ?? 0}
            className={inputClasses}
          >
            {SPICE_LEVELS.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="price" className="text-sm font-semibold text-espresso">
            Base price (GH₵)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min={0}
            step="0.01"
            defaultValue={meal?.price}
            className={inputClasses}
          />
          {state?.errors?.price && <p className="mt-1 text-xs text-brick">{state.errors.price[0]}</p>}
        </div>
        <div>
          <label htmlFor="quantityAvailable" className="text-sm font-semibold text-espresso">
            Quantity available today
          </label>
          <input
            id="quantityAvailable"
            name="quantityAvailable"
            type="number"
            min={0}
            defaultValue={meal?.quantityAvailable ?? 0}
            className={inputClasses}
          />
          {state?.errors?.quantityAvailable && (
            <p className="mt-1 text-xs text-brick">{state.errors.quantityAvailable[0]}</p>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-espresso">Sizes &amp; pricing</label>
          <button type="button" onClick={addSize} className="text-xs font-semibold text-paprika hover:underline">
            + Add size
          </button>
        </div>
        <div className="mt-2 flex flex-col gap-2">
          {sizes.map((row, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                placeholder="Label, e.g. Regular"
                value={row.label}
                onChange={(e) => updateSize(index, "label", e.target.value)}
                className={inputClasses + " mt-0"}
              />
              <input
                type="number"
                min={0}
                step="0.01"
                placeholder="Price"
                value={row.price}
                onChange={(e) => updateSize(index, "price", e.target.value)}
                className={inputClasses + " mt-0 w-32"}
              />
              {sizes.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSize(index)}
                  className="text-xs font-medium text-brick hover:underline"
                  aria-label="Remove size"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
        {state?.errors?.sizes && <p className="mt-1 text-xs text-brick">{state.errors.sizes[0]}</p>}
      </div>

      <ImageUploader currentImageUrl={meal?.imageUrl ?? null} />

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-espresso">
          <input type="checkbox" name="isAvailable" defaultChecked={meal?.isAvailable ?? true} />
          Available for order
        </label>
        <label className="flex items-center gap-2 text-sm text-espresso">
          <input type="checkbox" name="isFeatured" defaultChecked={meal?.isFeatured ?? false} />
          Feature on homepage
        </label>
      </div>

      {state?.message && <p className="text-sm text-brick">{state.message}</p>}

      <div className="flex gap-3">
        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? "Saving..." : meal ? "Save changes" : "Add meal"}
        </Button>
        <Button href="/admin/meals" variant="secondary">
          Cancel
        </Button>
      </div>
    </form>
  );
}
