import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { getOrder } from "@/lib/data/orders";
import { formatGHS } from "@/lib/utils";
import type { OrderStatus } from "@/types/order";

export const metadata: Metadata = {
  title: "Track Your Order | Nududu by Dzie",
};

function formatExpectedDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function getStatusMessage(status: OrderStatus, isDelivery: boolean) {
  switch (status) {
    case "new":
      return "We've received your order and will confirm it shortly.";
    case "confirmed":
      return "Your order has been confirmed and will be started soon.";
    case "preparing":
      return "Your food is being prepared right now.";
    case "ready":
      return isDelivery
        ? "Your order is ready and will be out for delivery shortly."
        : "Your order is ready for pickup.";
    case "completed":
      return isDelivery ? "Your order has been delivered. Enjoy!" : "Your order has been picked up. Enjoy!";
    case "cancelled":
      return "This order has been cancelled. Please contact us if you have questions.";
  }
}

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = await getOrder(orderId);

  if (!order) notFound();

  const isDelivery = order.fulfillmentMethod === "delivery";

  const rows = [
    { label: "Meal", value: `${order.mealName} (${order.sizeLabel})` },
    { label: "Quantity", value: String(order.quantity) },
    { label: "Total", value: formatGHS(order.total) },
    { label: "Fulfillment", value: isDelivery ? "Delivery" : "Pickup" },
    { label: isDelivery ? "Delivery address" : "Pickup note", value: order.location },
    { label: "Expected day", value: formatExpectedDate(order.expectedDate) },
  ];

  return (
    <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <div className="rounded-2xl border border-sand bg-surface p-6 sm:p-8">
        <StatusBadge status={order.status} />
        <h1 className="mt-4 font-heading text-3xl font-semibold text-espresso">
          Thank you, {order.customerName.split(" ")[0]}!
        </h1>
        <p className="mt-2 text-espresso-muted">
          Order <span className="font-semibold text-espresso">{order.orderNumber}</span>
          {" — "}
          {getStatusMessage(order.status, isDelivery)}
        </p>

        <dl className="mt-6 flex flex-col divide-y divide-sand rounded-xl border border-sand bg-cream">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between px-4 py-3 text-sm">
              <dt className="text-espresso-muted">{row.label}</dt>
              <dd className="text-right font-medium text-espresso">{row.value}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-6 text-sm text-espresso-muted">
          Payment is collected on {isDelivery ? "delivery" : "pickup"} &mdash; by cash or Mobile Money.
        </p>
        <p className="mt-2 text-xs text-espresso-muted">
          Bookmark this page to check your order status any time.
          {order.customerEmail && " We'll also email you as your order status changes."}
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Button href="/menu" variant="primary">
            Order something else
          </Button>
          <Button href="/" variant="secondary">
            Back to home
          </Button>
        </div>
      </div>
    </section>
  );
}
