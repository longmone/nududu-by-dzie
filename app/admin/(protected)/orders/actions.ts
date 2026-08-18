"use server";

import { revalidatePath } from "next/cache";
import { updateOrderStatus } from "@/lib/data/orders";
import type { OrderStatus } from "@/types/order";

export async function updateOrderStatusAction(orderId: string, status: OrderStatus) {
  await updateOrderStatus(orderId, status);
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
}
