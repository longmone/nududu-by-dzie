"use client";

import { useTransition } from "react";
import { updateOrderStatusAction } from "@/app/admin/(protected)/orders/actions";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/Button";
import type { FulfillmentMethod, OrderStatus } from "@/types/order";

export function OrderStatusActions({
  orderId,
  status,
  fulfillmentMethod,
}: {
  orderId: string;
  status: OrderStatus;
  fulfillmentMethod: FulfillmentMethod;
}) {
  const [pending, startTransition] = useTransition();

  function updateStatus(next: OrderStatus) {
    startTransition(() => updateOrderStatusAction(orderId, next));
  }

  const nextStep: { status: OrderStatus; label: string } | null =
    status === "new"
      ? { status: "confirmed", label: "Confirm order" }
      : status === "confirmed"
        ? { status: "preparing", label: "Start preparing" }
        : status === "preparing"
          ? { status: "ready", label: "Mark ready" }
          : status === "ready"
            ? {
                status: "completed",
                label: fulfillmentMethod === "delivery" ? "Mark delivered" : "Mark picked up",
              }
            : null;

  const canCancel = status !== "completed" && status !== "cancelled";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <StatusBadge status={status} />
      {nextStep && (
        <Button type="button" variant="primary" disabled={pending} onClick={() => updateStatus(nextStep.status)}>
          {pending ? "Updating..." : nextStep.label}
        </Button>
      )}
      {canCancel && (
        <Button
          type="button"
          variant="secondary"
          disabled={pending}
          className="border-brick text-brick hover:bg-brick hover:text-white"
          onClick={() => {
            if (confirm("Cancel this order? The customer will be notified by email if they provided one.")) {
              updateStatus("cancelled");
            }
          }}
        >
          Cancel order
        </Button>
      )}
    </div>
  );
}
