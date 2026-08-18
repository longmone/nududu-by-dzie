import { createClient } from "@/lib/supabase/server";
import { getMealImage } from "@/lib/images/default-images";
import { slugify } from "@/lib/utils";
import type { MealFormValues } from "@/lib/validation/meal-schema";
import type { Meal, MealCategory, MealSize, SpiceLevel } from "@/types/meal";

type MealRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  spice_level: number;
  price: number;
  sizes: MealSize[];
  quantity_available: number;
  is_available: boolean;
  is_featured: boolean;
  image_url: string | null;
  categories: { slug: string } | { slug: string }[] | null;
};

function mapMealRow(row: MealRow): Meal {
  const categorySlug = Array.isArray(row.categories)
    ? row.categories[0]?.slug
    : row.categories?.slug;
  const category: MealCategory = categorySlug === "continental" ? "continental" : "local";

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    category,
    spiceLevel: row.spice_level as SpiceLevel,
    price: Number(row.price),
    sizes: (row.sizes ?? []).map((size) => ({ label: size.label, price: Number(size.price) })),
    quantityAvailable: row.quantity_available,
    isAvailable: row.is_available,
    isFeatured: row.is_featured,
    image: getMealImage(row.image_url, category),
  };
}

const MEAL_SELECT = "id, name, slug, description, spice_level, price, sizes, quantity_available, is_available, is_featured, image_url, categories(slug)";

export async function getMeals(category?: MealCategory) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("meals")
    .select(MEAL_SELECT)
    .order("created_at", { ascending: true })
    .returns<MealRow[]>();

  if (error) throw error;

  const meals = (data ?? []).map(mapMealRow);
  return category ? meals.filter((meal) => meal.category === category) : meals;
}

export async function getFeaturedMeals() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("meals")
    .select(MEAL_SELECT)
    .eq("is_featured", true)
    .order("created_at", { ascending: true })
    .returns<MealRow[]>();

  if (error) throw error;
  return (data ?? []).map(mapMealRow);
}

export async function getMealBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("meals")
    .select(MEAL_SELECT)
    .eq("slug", slug)
    .maybeSingle()
    .returns<MealRow>();

  if (error) throw error;
  return data ? mapMealRow(data) : null;
}

export interface AdminMeal {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  spiceLevel: SpiceLevel;
  price: number;
  sizes: MealSize[];
  quantityAvailable: number;
  isAvailable: boolean;
  isFeatured: boolean;
  imageUrl: string | null;
}

const ADMIN_MEAL_SELECT =
  "id, name, slug, description, category_id, spice_level, price, sizes, quantity_available, is_available, is_featured, image_url";

type AdminMealRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category_id: string;
  spice_level: number;
  price: number;
  sizes: MealSize[];
  quantity_available: number;
  is_available: boolean;
  is_featured: boolean;
  image_url: string | null;
};

function mapAdminMealRow(row: AdminMealRow): AdminMeal {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    categoryId: row.category_id,
    spiceLevel: row.spice_level as SpiceLevel,
    price: Number(row.price),
    sizes: (row.sizes ?? []).map((size) => ({ label: size.label, price: Number(size.price) })),
    quantityAvailable: row.quantity_available,
    isAvailable: row.is_available,
    isFeatured: row.is_featured,
    imageUrl: row.image_url,
  };
}

export async function getAllMealsAdmin(): Promise<AdminMeal[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("meals")
    .select(ADMIN_MEAL_SELECT)
    .order("created_at", { ascending: false })
    .returns<AdminMealRow[]>();

  if (error) throw error;
  return (data ?? []).map(mapAdminMealRow);
}

export async function getMealById(id: string): Promise<AdminMeal | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("meals")
    .select(ADMIN_MEAL_SELECT)
    .eq("id", id)
    .maybeSingle()
    .returns<AdminMealRow>();

  if (error) throw error;
  return data ? mapAdminMealRow(data) : null;
}

async function uploadMealImage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  slug: string,
  file: File
) {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${slug}-${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from("meal-photos").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  return supabase.storage.from("meal-photos").getPublicUrl(path).data.publicUrl;
}

export async function createMeal(values: MealFormValues, imageFile: File | null) {
  const supabase = await createClient();
  const baseSlug = slugify(values.name);

  let imageUrl: string | null = null;
  if (imageFile && imageFile.size > 0) {
    imageUrl = await uploadMealImage(supabase, baseSlug, imageFile);
  }

  const payload = {
    name: values.name,
    description: values.description,
    category_id: values.categoryId,
    spice_level: values.spiceLevel,
    price: values.price,
    sizes: values.sizes,
    quantity_available: values.quantityAvailable,
    is_available: values.isAvailable,
    is_featured: values.isFeatured,
    image_url: imageUrl,
  };

  let { data, error } = await supabase
    .from("meals")
    .insert({ ...payload, slug: baseSlug })
    .select("id")
    .single();

  if (error?.code === "23505") {
    const uniqueSlug = `${baseSlug}-${Date.now().toString(36)}`;
    ({ data, error } = await supabase
      .from("meals")
      .insert({ ...payload, slug: uniqueSlug })
      .select("id")
      .single());
  }

  if (error) throw error;
  return data;
}

export async function updateMeal(
  id: string,
  values: MealFormValues,
  imageFile: File | null,
  removeImage: boolean
) {
  const supabase = await createClient();

  const payload: Record<string, unknown> = {
    name: values.name,
    description: values.description,
    category_id: values.categoryId,
    spice_level: values.spiceLevel,
    price: values.price,
    sizes: values.sizes,
    quantity_available: values.quantityAvailable,
    is_available: values.isAvailable,
    is_featured: values.isFeatured,
  };

  if (imageFile && imageFile.size > 0) {
    payload.image_url = await uploadMealImage(supabase, slugify(values.name), imageFile);
  } else if (removeImage) {
    payload.image_url = null;
  }

  const { error } = await supabase.from("meals").update(payload).eq("id", id);
  if (error) throw error;
}

export async function deleteMeal(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("meals").delete().eq("id", id);
  if (error) throw error;
}
