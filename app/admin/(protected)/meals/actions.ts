"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { mealFormSchema } from "@/lib/validation/meal-schema";
import { createMeal, deleteMeal, updateMeal } from "@/lib/data/meals";

export type MealFormState =
  | {
      errors?: Record<string, string[] | undefined>;
      message?: string;
    }
  | undefined;

function parseMealFormData(formData: FormData) {
  let sizes: unknown = [];
  try {
    sizes = JSON.parse(String(formData.get("sizes") || "[]"));
  } catch {
    sizes = [];
  }

  return mealFormSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    categoryId: formData.get("categoryId"),
    spiceLevel: formData.get("spiceLevel"),
    price: formData.get("price"),
    quantityAvailable: formData.get("quantityAvailable"),
    isAvailable: formData.get("isAvailable") === "on",
    isFeatured: formData.get("isFeatured") === "on",
    sizes,
  });
}

export async function createMealAction(
  _prevState: MealFormState,
  formData: FormData
): Promise<MealFormState> {
  const validated = parseMealFormData(formData);
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const imageFile = formData.get("image");

  try {
    await createMeal(validated.data, imageFile instanceof File ? imageFile : null);
  } catch (error) {
    return { message: error instanceof Error ? error.message : "Could not create meal." };
  }

  revalidatePath("/admin/meals");
  revalidatePath("/menu");
  redirect("/admin/meals");
}

export async function updateMealAction(
  mealId: string,
  _prevState: MealFormState,
  formData: FormData
): Promise<MealFormState> {
  const validated = parseMealFormData(formData);
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const imageFile = formData.get("image");
  const removeImage = formData.get("removeImage") === "true";

  try {
    await updateMeal(mealId, validated.data, imageFile instanceof File ? imageFile : null, removeImage);
  } catch (error) {
    return { message: error instanceof Error ? error.message : "Could not update meal." };
  }

  revalidatePath("/admin/meals");
  revalidatePath("/menu");
  redirect("/admin/meals");
}

export async function deleteMealAction(mealId: string) {
  await deleteMeal(mealId);
  revalidatePath("/admin/meals");
  revalidatePath("/menu");
}
