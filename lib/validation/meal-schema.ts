import { z } from "zod";

export const mealSizeSchema = z.object({
  label: z.string().trim().min(1, "Size label is required."),
  price: z.coerce.number().min(0, "Price must be 0 or more."),
});

export const mealFormSchema = z.object({
  name: z.string().trim().min(2, "Name is required."),
  description: z.string().trim().min(10, "Add a short description (10+ characters)."),
  categoryId: z.string().uuid("Please choose a category."),
  spiceLevel: z.coerce.number().int().min(0).max(4),
  price: z.coerce.number().min(0, "Base price must be 0 or more."),
  quantityAvailable: z.coerce.number().int().min(0, "Quantity must be 0 or more."),
  isAvailable: z.boolean(),
  isFeatured: z.boolean(),
  sizes: z.array(mealSizeSchema).min(1, "Add at least one size option."),
});

export type MealFormValues = z.infer<typeof mealFormSchema>;
