import { createClient, hasSupabaseConfig } from "@/lib/supabase/server";
import { getMealImage } from "@/lib/images/default-images";
import { slugify } from "@/lib/utils";
import type { MealFormValues } from "@/lib/validation/meal-schema";
import type { Meal, MealCategory, MealSize, SpiceLevel } from "@/types/meal";

const FALLBACK_MEALS: Meal[] = [
  {
    id: "local-jollof-rice",
    slug: "jollof-rice",
    name: "Spicy Jollof Rice",
    description: "Rich, smoky tomato rice with tender chicken and a fiery Ghanaian kick.",
    category: "local",
    spiceLevel: 3,
    price: 45,
    sizes: [
      { label: "Regular", price: 45 },
      { label: "Large", price: 65 },
    ],
    quantityAvailable: 12,
    isAvailable: true,
    isFeatured: true,
    image: "/images/local-dishes/jollof-rice-1.jpg",
  },
  {
    id: "local-banku-okro",
    slug: "banku-okro-soup",
    name: "Banku with Okro Soup",
    description: "A comforting classic with smooth banku and a rich, savory okro soup.",
    category: "local",
    spiceLevel: 2,
    price: 40,
    sizes: [
      { label: "Regular", price: 40 },
      { label: "Large", price: 58 },
    ],
    quantityAvailable: 10,
    isAvailable: true,
    isFeatured: true,
    image: "/images/local-dishes/banku-okro-soup-1.jpg",
  },
  {
    id: "local-spicy-chicken",
    slug: "spicy-chicken",
    name: "Spicy Chicken",
    description: "Crisp, juicy, and perfectly seasoned with bold peppers and local spice.",
    category: "local",
    spiceLevel: 4,
    price: 50,
    sizes: [
      { label: "Regular", price: 50 },
      { label: "Large", price: 70 },
    ],
    quantityAvailable: 9,
    isAvailable: true,
    isFeatured: true,
    image: "/images/local-dishes/spicy-chicken-1.jpg",
  },
  {
    id: "continental-pasta",
    slug: "creamy-pasta",
    name: "Creamy Chicken Pasta",
    description: "A hearty continental favorite with creamy sauce, herbs, and grilled chicken.",
    category: "continental",
    spiceLevel: 1,
    price: 55,
    sizes: [
      { label: "Regular", price: 55 },
      { label: "Large", price: 75 },
    ],
    quantityAvailable: 8,
    isAvailable: true,
    isFeatured: true,
    image: "/images/continental-dishes/pasta-1.jpg",
  },
  {
    id: "continental-grilled-chicken",
    slug: "grilled-chicken-continental",
    name: "Grilled Chicken Continental",
    description: "Tender grilled chicken served with a satisfying side and savory seasoning.",
    category: "continental",
    spiceLevel: 2,
    price: 60,
    sizes: [
      { label: "Regular", price: 60 },
      { label: "Large", price: 82 },
    ],
    quantityAvailable: 6,
    isAvailable: true,
    isFeatured: false,
    image: "/images/continental-dishes/grilled-chicken-continental-1.jpg",
  },
];

function getFallbackMeals(category?: MealCategory) {
  return category
    ? FALLBACK_MEALS.filter((meal) => meal.category === category)
    : FALLBACK_MEALS;
}

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
  if (!hasSupabaseConfig()) return getFallbackMeals(category);

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("meals")
      .select(MEAL_SELECT)
      .order("created_at", { ascending: true })
      .returns<MealRow[]>();

    if (error) throw error;

    const meals = (data ?? []).map(mapMealRow);
    return category ? meals.filter((meal) => meal.category === category) : meals;
  } catch {
    return getFallbackMeals(category);
  }
}

export async function getFeaturedMeals() {
  if (!hasSupabaseConfig()) return getFallbackMeals().filter((meal) => meal.isFeatured);

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("meals")
      .select(MEAL_SELECT)
      .eq("is_featured", true)
      .order("created_at", { ascending: true })
      .returns<MealRow[]>();

    if (error) throw error;
    return (data ?? []).map(mapMealRow);
  } catch {
    return getFallbackMeals().filter((meal) => meal.isFeatured);
  }
}

export async function getMealBySlug(slug: string) {
  if (!hasSupabaseConfig()) {
    return getFallbackMeals().find((meal) => meal.slug === slug) ?? null;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("meals")
      .select(MEAL_SELECT)
      .eq("slug", slug)
      .maybeSingle()
      .returns<MealRow>();

    if (error) throw error;
    return data ? mapMealRow(data) : null;
  } catch {
    return getFallbackMeals().find((meal) => meal.slug === slug) ?? null;
  }
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
  if (!hasSupabaseConfig()) {
    return getFallbackMeals().map((meal) => ({
      id: meal.id,
      name: meal.name,
      slug: meal.slug,
      description: meal.description,
      categoryId: meal.category,
      spiceLevel: meal.spiceLevel,
      price: meal.price,
      sizes: meal.sizes,
      quantityAvailable: meal.quantityAvailable,
      isAvailable: meal.isAvailable,
      isFeatured: meal.isFeatured,
      imageUrl: meal.image,
    }));
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("meals")
      .select(ADMIN_MEAL_SELECT)
      .order("created_at", { ascending: false })
      .returns<AdminMealRow[]>();

    if (error) throw error;
    return (data ?? []).map(mapAdminMealRow);
  } catch {
    return getFallbackMeals().map((meal) => ({
      id: meal.id,
      name: meal.name,
      slug: meal.slug,
      description: meal.description,
      categoryId: meal.category,
      spiceLevel: meal.spiceLevel,
      price: meal.price,
      sizes: meal.sizes,
      quantityAvailable: meal.quantityAvailable,
      isAvailable: meal.isAvailable,
      isFeatured: meal.isFeatured,
      imageUrl: meal.image,
    }));
  }
}

export async function getMealById(id: string): Promise<AdminMeal | null> {
  if (!hasSupabaseConfig()) {
    const meal = getFallbackMeals().find((item) => item.id === id);
    return meal
      ? {
          id: meal.id,
          name: meal.name,
          slug: meal.slug,
          description: meal.description,
          categoryId: meal.category,
          spiceLevel: meal.spiceLevel,
          price: meal.price,
          sizes: meal.sizes,
          quantityAvailable: meal.quantityAvailable,
          isAvailable: meal.isAvailable,
          isFeatured: meal.isFeatured,
          imageUrl: meal.image,
        }
      : null;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("meals")
      .select(ADMIN_MEAL_SELECT)
      .eq("id", id)
      .maybeSingle()
      .returns<AdminMealRow>();

    if (error) throw error;
    return data ? mapAdminMealRow(data) : null;
  } catch {
    const meal = getFallbackMeals().find((item) => item.id === id);
    return meal
      ? {
          id: meal.id,
          name: meal.name,
          slug: meal.slug,
          description: meal.description,
          categoryId: meal.category,
          spiceLevel: meal.spiceLevel,
          price: meal.price,
          sizes: meal.sizes,
          quantityAvailable: meal.quantityAvailable,
          isAvailable: meal.isAvailable,
          isFeatured: meal.isFeatured,
          imageUrl: meal.image,
        }
      : null;
  }
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
  if (!hasSupabaseConfig()) {
    throw new Error("Meal management is unavailable because Supabase is not configured.");
  }

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
  if (!hasSupabaseConfig()) {
    throw new Error("Meal management is unavailable because Supabase is not configured.");
  }

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
  if (!hasSupabaseConfig()) {
    throw new Error("Meal management is unavailable because Supabase is not configured.");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("meals").delete().eq("id", id);
  if (error) throw error;
}
