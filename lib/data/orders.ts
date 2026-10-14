import { createClient, hasSupabaseConfig } from "@/lib/supabase/server";
import { sendOrderNotification } from "@/lib/email/send-order-notification";
import { sendCustomerOrderReceivedEmail, sendCustomerStatusUpdateEmail } from "@/lib/email/send-customer-notification";
import type { CreateOrderInput, Order } from "@/types/order";

type OrderRpcRow = {
  id: string;
  order_number: string;
  meal_name: string;
  size_label: string;
  quantity: number;
  unit_price: number;
  total: number;
  customer_name: string;
  customer_email: string | null;
  fulfillment_method: Order["fulfillmentMethod"];
  location: string;
  expected_date: string;
  status: Order["status"];
  created_at: string;
};

function mapOrderRow(row: OrderRpcRow): Order {
  return {
    id: row.id,
    orderNumber: row.order_number,
    mealName: row.meal_name,
    sizeLabel: row.size_label,
    quantity: row.quantity,
    unitPrice: Number(row.unit_price),
    total: Number(row.total),
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    fulfillmentMethod: row.fulfillment_method,
    location: row.location,
    expectedDate: row.expected_date,
    status: row.status,
    createdAt: row.created_at,
  };
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  if (!hasSupabaseConfig()) {
    throw new Error("Ordering is unavailable because Supabase is not configured.");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .rpc("create_order", {
      p_meal_id: input.mealId,
      p_size_label: input.sizeLabel,
      p_quantity: input.quantity,
      p_customer_name: input.customerName,
      p_customer_phone: input.customerPhone,
      p_customer_email: input.customerEmail ?? null,
      p_fulfillment_method: input.fulfillmentMethod,
      p_location: input.location,
      p_expected_date: input.expectedDate,
      p_notes: input.notes ?? null,
    })
    .returns<OrderRpcRow[]>()
    .single();

  if (error) throw error;
  const order = mapOrderRow(data);

  try {
    await sendOrderNotification({
      id: order.id,
      orderNumber: order.orderNumber,
      mealName: order.mealName,
      sizeLabel: order.sizeLabel,
      quantity: order.quantity,
      unitPrice: order.unitPrice,
      total: order.total,
      customerName: order.customerName,
      customerPhone: input.customerPhone,
      fulfillmentMethod: order.fulfillmentMethod,
      location: order.location,
      expectedDate: order.expectedDate,
      notes: input.notes,
      createdAt: order.createdAt,
    });
  } catch (emailError) {
    console.error("Failed to send order notification email to owner:", emailError);
  }

  try {
    await sendCustomerOrderReceivedEmail(order);
  } catch (emailError) {
    console.error("Failed to send order received email to customer:", emailError);
  }

  return order;
}

export async function getOrder(id: string): Promise<Order | null> {
  if (!hasSupabaseConfig()) return null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .rpc("get_order", { p_id: id })
      .returns<OrderRpcRow[]>()
      .maybeSingle();

    if (error) throw error;
    return data ? mapOrderRow(data) : null;
  } catch {
    return null;
  }
}

type OrderTableRow = OrderRpcRow & { customer_phone: string; notes: string | null };

function mapOrderTableRow(row: OrderTableRow): Order & { customerPhone: string; notes: string | null } {
  return { ...mapOrderRow(row), customerPhone: row.customer_phone, notes: row.notes };
}

const ADMIN_ORDER_SELECT =
  "id, order_number, meal_name, size_label, quantity, unit_price, total, customer_name, customer_email, customer_phone, fulfillment_method, location, expected_date, notes, status, created_at";

export async function getOrdersAdmin(status?: Order["status"]) {
  if (!hasSupabaseConfig()) return [];

  try {
    const supabase = await createClient();
    let query = supabase
      .from("orders")
      .select(ADMIN_ORDER_SELECT)
      .order("created_at", { ascending: false });

    if (status) query = query.eq("status", status);

    const { data, error } = await query.returns<OrderTableRow[]>();
    if (error) throw error;
    return (data ?? []).map(mapOrderTableRow);
  } catch {
    return [];
  }
}

export async function getOrderByIdAdmin(id: string) {
  if (!hasSupabaseConfig()) return null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("orders")
      .select(ADMIN_ORDER_SELECT)
      .eq("id", id)
      .maybeSingle()
      .returns<OrderTableRow>();

    if (error) throw error;
    return data ? mapOrderTableRow(data) : null;
  } catch {
    return null;
  }
}

export async function updateOrderStatus(id: string, status: Order["status"]) {
  if (!hasSupabaseConfig()) return;

  const supabase = await createClient();
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) throw error;

  try {
    const order = await getOrderByIdAdmin(id);
    if (order) {
      await sendCustomerStatusUpdateEmail(order, status);
    }
  } catch (emailError) {
    console.error("Failed to send status update email to customer:", emailError);
  }
}
