import { Badge } from "@/components/ui/Badge";
import type { OrderStatus } from "@/types/order";

const STATUS_TONE: Record<OrderStatus, "turmeric" | "sage" | "brick" | "sand"> = {
  new: "turmeric",
  confirmed: "sand",
  preparing: "sand",
  ready: "sage",
  completed: "sage",
  cancelled: "brick",
};

const STATUS_LABEL: Record<OrderStatus, string> = {
  new: "New",
  confirmed: "Confirmed",
  preparing: "Preparing",
  ready: "Ready",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return <Badge tone={STATUS_TONE[status]}>{STATUS_LABEL[status]}</Badge>;
}
