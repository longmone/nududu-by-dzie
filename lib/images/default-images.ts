import type { MealCategory } from "@/types/meal";

const DEFAULT_IMAGES: Record<MealCategory, string> = {
  local: "/images/local-dishes/jollof-rice-1.jpg",
  continental: "/images/continental-dishes/pasta-1.jpg",
};

export function getMealImage(image: string | null, category: MealCategory) {
  return image || DEFAULT_IMAGES[category];
}
