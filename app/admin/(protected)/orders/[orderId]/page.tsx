import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { OrderStatusActions } from "@/components/admin/OrderStatusActions";
import { getOrderByIdAdmin } from "@/lib/data/orders";
import { formatGHS } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Order Detail | Nududu by Dzie Admin",
};

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = await getOrderByIdAdmin(orderId);

  if (!order) notFound();

  const rows = [
    { label: "Meal", value: `${order.mealName} (${order.sizeLabel}) × ${order.quantity}` },
    { label: "Unit price", value: formatGHS(order.unitPrice) },
    { label: "Total", value: formatGHS(order.total) },
    { label: "Customer", value: order.customerName },
    { label: "Phone", value: order.customerPhone },
    { label: "Email", value: order.customerEmail || "—" },
    { label: "Fulfillment", value: order.fulfillmentMethod === "delivery" ? "Delivery" : "Pickup" },
    { label: order.fulfillmentMethod === "delivery" ? "Delivery address" : "Pickup note", value: order.location },
    {
      label: "Expected day",
      value: new Date(`${order.expectedDate}T00:00:00`).toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }),
    },
    { label: "Notes", value: order.notes || "—" },
    {
      label: "Placed",
      value: new Date(order.createdAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }),
    },
  ];

  return (
    <div className="max-w-2xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-heading text-2xl font-semibold text-espresso">{order.orderNumber}</h1>
        <OrderStatusActions orderId={order.id} status={order.status} fulfillmentMethod={order.fulfillmentMethod} />
      </div>

      <dl className="mt-6 flex flex-col divide-y divide-sand rounded-2xl border border-sand bg-surface">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
            <dt className="text-espresso-muted">{row.label}</dt>
            <dd className="text-right font-medium text-espresso">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
