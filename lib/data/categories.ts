import { createClient, hasSupabaseConfig } from "@/lib/supabase/server";

export interface Category {
  id: string;
  name: string;
  slug: string;
}

const FALLBACK_CATEGORIES: Category[] = [
  { id: "local", name: "Local", slug: "local" },
  { id: "continental", name: "Continental", slug: "continental" },
];

export async function getCategories(): Promise<Category[]> {
  if (!hasSupabaseConfig()) return FALLBACK_CATEGORIES;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, slug")
      .order("display_order", { ascending: true });

    if (error) throw error;
    return data ?? FALLBACK_CATEGORIES;
  } catch {
    return FALLBACK_CATEGORIES;
  }
}
