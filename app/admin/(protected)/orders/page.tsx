import Link from "next/link";
import type { Metadata } from "next";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { getOrdersAdmin } from "@/lib/data/orders";
import { formatGHS } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types/order";

export const metadata: Metadata = {
  title: "Orders | Nududu by Dzie Admin",
};

const STATUS_FILTERS: { value: OrderStatus | undefined; label: string }[] = [
  { value: undefined, label: "All" },
  { value: "new", label: "New" },
  { value: "confirmed", label: "Confirmed" },
  { value: "preparing", label: "Preparing" },
  { value: "ready", label: "Ready" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

function isOrderStatus(value: string | undefined): value is OrderStatus {
  return ["new", "confirmed", "preparing", "ready", "completed", "cancelled"].includes(value ?? "");
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeStatus = isOrderStatus(status) ? status : undefined;
  const orders = await getOrdersAdmin(activeStatus);

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-espresso">Orders</h1>
      <p className="mt-1 text-sm text-espresso-muted">Review and manage customer orders.</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((filter) => {
          const isActive = activeStatus === filter.value;
          return (
            <Link
              key={filter.label}
              href={filter.value ? `/admin/orders?status=${filter.value}` : "/admin/orders"}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                isActive
                  ? "border-paprika bg-paprika text-white"
                  : "border-sand text-espresso-muted hover:border-paprika hover:text-paprika"
              )}
            >
              {filter.label}
            </Link>
          );
        })}
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-sand bg-surface">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-sand text-xs uppercase tracking-wide text-espresso-muted">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Meal</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Expected</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${order.id}`} className="font-medium text-paprika hover:underline">
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="px-4 py-3 text-espresso">{order.customerName}</td>
                <td className="px-4 py-3 text-espresso-muted">
                  {order.mealName} ({order.sizeLabel}) &times; {order.quantity}
                </td>
                <td className="px-4 py-3 text-espresso-muted">{formatGHS(order.total)}</td>
                <td className="px-4 py-3 text-espresso-muted">
                  {new Date(`${order.expectedDate}T00:00:00`).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  })}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="p-6 text-center text-sm text-espresso-muted">No orders in this view yet.</p>
        )}
      </div>
    </div>
  );
}
