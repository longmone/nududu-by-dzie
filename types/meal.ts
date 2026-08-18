export type MealCategory = "local" | "continental";

export type SpiceLevel = 0 | 1 | 2 | 3 | 4;

export interface MealSize {
  label: string;
  price: number;
}

export interface Meal {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: MealCategory;
  spiceLevel: SpiceLevel;
  price: number;
  sizes: MealSize[];
  quantityAvailable: number;
  isAvailable: boolean;
  isFeatured: boolean;
  image: string;
}
