"use server";

import { redirect } from "next/navigation";
import { orderFormSchema } from "@/lib/validation/order-schema";
import { createOrder } from "@/lib/data/orders";

export type OrderFormState =
  | {
      errors?: Record<string, string[] | undefined>;
      message?: string;
    }
  | undefined;

export async function submitOrder(
  mealId: string,
  _prevState: OrderFormState,
  formData: FormData
): Promise<OrderFormState> {
  const validated = orderFormSchema.safeParse({
    mealId,
    sizeLabel: formData.get("sizeLabel"),
    quantity: formData.get("quantity"),
    customerName: formData.get("customerName"),
    customerPhone: formData.get("customerPhone"),
    customerEmail: formData.get("customerEmail") || undefined,
    fulfillmentMethod: formData.get("fulfillmentMethod"),
    location: formData.get("location"),
    expectedDate: formData.get("expectedDate"),
    notes: formData.get("notes") || undefined,
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  let orderId: string;
  try {
    const order = await createOrder(validated.data);
    orderId = order.id;
  } catch (error) {
    return {
      message:
        error instanceof Error ? error.message : "Something went wrong. Please try again.",
    };
  }

  redirect(`/order/confirmation/${orderId}`);
}
