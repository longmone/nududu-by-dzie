import { getGmailTransporter } from "@/lib/email/transporter";
import { getSiteUrl, renderOrderEmailHtml, renderOrderEmailText } from "@/lib/email/template";
import { formatGHS } from "@/lib/utils";
import type { FulfillmentMethod, OrderStatus } from "@/types/order";

export interface CustomerOrderEmailDetails {
  id: string;
  orderNumber: string;
  mealName: string;
  sizeLabel: string;
  quantity: number;
  total: number;
  fulfillmentMethod: FulfillmentMethod;
  location: string;
  expectedDate: string;
  customerEmail: string | null;
}

function formatExpectedDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function buildRows(order: CustomerOrderEmailDetails) {
  return [
    { label: "Order number", value: order.orderNumber },
    { label: "Meal", value: `${order.mealName} (${order.sizeLabel}) × ${order.quantity}` },
    { label: "Total", value: formatGHS(order.total) },
    { label: "Fulfillment", value: order.fulfillmentMethod === "delivery" ? "Delivery" : "Pickup" },
    {
      label: order.fulfillmentMethod === "delivery" ? "Delivery address" : "Pickup note",
      value: order.location,
    },
    { label: "Expected day", value: formatExpectedDate(order.expectedDate) },
  ];
}

type StatusCopy = { eyebrow: string; heading: string; intro: string };

const STATUS_COPY: Record<"new" | "confirmed" | "preparing" | "cancelled", StatusCopy> = {
  new: {
    eyebrow: "Order received",
    heading: "We've got your order!",
    intro: "Thanks for ordering from Nududu by Dzie. We'll confirm it shortly.",
  },
  confirmed: {
    eyebrow: "Order update",
    heading: "Your order is confirmed",
    intro: "Nududu by Dzie has confirmed your order and will start on it soon.",
  },
  preparing: {
    eyebrow: "Order update",
    heading: "Your order is being prepared",
    intro: "Your food is on the stove — we'll let you know as soon as it's ready.",
  },
  cancelled: {
    eyebrow: "Order update",
    heading: "Your order was cancelled",
    intro: "Your order has been cancelled. If this wasn't expected, please reach out to us.",
  },
};

function getStatusCopy(order: CustomerOrderEmailDetails, status: OrderStatus): StatusCopy {
  const isDelivery = order.fulfillmentMethod === "delivery";

  if (status === "ready") {
    return {
      eyebrow: "Order update",
      heading: "Your order is ready",
      intro: isDelivery
        ? "Your food is ready and will be out for delivery shortly."
        : "Your food is ready for pickup whenever you're set to come by.",
    };
  }

  if (status === "completed") {
    return {
      eyebrow: "Order update",
      heading: isDelivery ? "Your order has been delivered" : "Your order has been picked up",
      intro: "Thanks for ordering from Nududu by Dzie — enjoy your meal!",
    };
  }

  return STATUS_COPY[status];
}

async function sendCustomerEmail(
  order: CustomerOrderEmailDetails,
  status: OrderStatus,
  subjectPrefix: string
) {
  if (!order.customerEmail) return;

  const { user, transporter } = getGmailTransporter();
  const copy = getStatusCopy(order, status);
  const rows = buildRows(order);
  const trackUrl = `${getSiteUrl()}/order/confirmation/${order.id}`;

  await transporter.sendMail({
    from: `Nududu by Dzie <${user}>`,
    to: order.customerEmail,
    subject: `${subjectPrefix} ${order.orderNumber} — Nududu by Dzie`,
    text: renderOrderEmailText(rows, copy.intro),
    html: renderOrderEmailHtml({
      eyebrow: copy.eyebrow,
      heading: copy.heading,
      intro: copy.intro,
      rows,
      ctaLabel: "Track your order",
      ctaUrl: trackUrl,
    }),
  });
}

export async function sendCustomerOrderReceivedEmail(order: CustomerOrderEmailDetails) {
  await sendCustomerEmail(order, "new", "Order received");
}

export async function sendCustomerStatusUpdateEmail(
  order: CustomerOrderEmailDetails,
  status: OrderStatus
) {
  await sendCustomerEmail(order, status, "Order update");
}
