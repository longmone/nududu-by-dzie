import { getGmailTransporter } from "@/lib/email/transporter";
import { getSiteUrl, renderOrderEmailHtml, renderOrderEmailText } from "@/lib/email/template";
import { formatGHS } from "@/lib/utils";
import type { FulfillmentMethod } from "@/types/order";

export interface OrderNotificationDetails {
  id: string;
  orderNumber: string;
  mealName: string;
  sizeLabel: string;
  quantity: number;
  unitPrice: number;
  total: number;
  customerName: string;
  customerPhone: string;
  fulfillmentMethod: FulfillmentMethod;
  location: string;
  expectedDate: string;
  notes?: string;
  createdAt: string;
}

function formatExpectedDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function buildRows(order: OrderNotificationDetails) {
  return [
    { label: "Order number", value: order.orderNumber },
    { label: "Meal", value: `${order.mealName} (${order.sizeLabel}) × ${order.quantity}` },
    { label: "Unit price", value: formatGHS(order.unitPrice) },
    { label: "Total", value: formatGHS(order.total) },
    { label: "Customer", value: order.customerName },
    { label: "Phone", value: order.customerPhone },
    { label: "Fulfillment", value: order.fulfillmentMethod === "delivery" ? "Delivery" : "Pickup" },
    {
      label: order.fulfillmentMethod === "delivery" ? "Delivery address" : "Pickup note",
      value: order.location,
    },
    { label: "Expected day", value: formatExpectedDate(order.expectedDate) },
    { label: "Notes", value: order.notes && order.notes.length > 0 ? order.notes : "—" },
  ];
}

export async function sendOrderNotification(order: OrderNotificationDetails) {
  const to = process.env.ORDER_NOTIFICATION_EMAIL;
  if (!to) {
    throw new Error("Email notification is not configured (missing ORDER_NOTIFICATION_EMAIL).");
  }

  const { user, transporter } = getGmailTransporter();
  const rows = buildRows(order);
  const footerNote = `Placed ${new Date(order.createdAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}`;

  await transporter.sendMail({
    from: `Nududu by Dzie <${user}>`,
    to,
    subject: `New order ${order.orderNumber} — ${order.mealName}`,
    text: renderOrderEmailText(rows, footerNote),
    html: renderOrderEmailHtml({
      eyebrow: "New order",
      heading: "Nududu by Dzie",
      rows,
      footerNote,
      ctaLabel: "View order",
      ctaUrl: `${getSiteUrl()}/admin/orders/${order.id}`,
    }),
  });
}
