export type FulfillmentMethod = "pickup" | "delivery";

export type OrderStatus =
  | "new"
  | "confirmed"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";

export interface Order {
  id: string;
  orderNumber: string;
  mealName: string;
  sizeLabel: string;
  quantity: number;
  unitPrice: number;
  total: number;
  customerName: string;
  customerEmail: string | null;
  fulfillmentMethod: FulfillmentMethod;
  location: string;
  expectedDate: string;
  status: OrderStatus;
  createdAt: string;
}

export interface CreateOrderInput {
  mealId: string;
  sizeLabel: string;
  quantity: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  fulfillmentMethod: FulfillmentMethod;
  location: string;
  expectedDate: string;
  notes?: string;
}
