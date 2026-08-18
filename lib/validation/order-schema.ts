import { z } from "zod";

export const orderFormSchema = z.object({
  mealId: z.string().uuid(),
  sizeLabel: z.string().min(1, "Please choose a size."),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1.").max(20, "For orders over 20, please contact us directly."),
  customerName: z.string().trim().min(2, "Please enter your name."),
  customerPhone: z.string().trim().min(9, "Please enter a valid contact number."),
  customerEmail: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .optional()
    .or(z.literal("")),
  fulfillmentMethod: z.enum(["pickup", "delivery"]),
  location: z.string().trim().min(3, "Please tell us where to deliver or where you'll pick up."),
  expectedDate: z
    .string()
    .min(1, "Please choose the day you'd like your order."),
  notes: z.string().trim().max(300, "Notes must be under 300 characters.").optional(),
});

export type OrderFormValues = z.infer<typeof orderFormSchema>;
