"use client";

import { useActionState, useState } from "react";
import { submitOrder, type OrderFormState } from "@/app/(site)/menu/[mealSlug]/actions";
import { Button } from "@/components/ui/Button";
import { cn, formatGHS } from "@/lib/utils";
import type { Meal } from "@/types/meal";

const initialState: OrderFormState = undefined;

function todayISODate() {
  return new Date().toISOString().split("T")[0];
}

export function OrderForm({ meal }: { meal: Meal }) {
  const action = submitOrder.bind(null, meal.id);
  const [state, formAction, pending] = useActionState(action, initialState);
  const [sizeLabel, setSizeLabel] = useState(meal.sizes[0]?.label ?? "Regular");
  const [quantity, setQuantity] = useState(1);
  const [fulfillmentMethod, setFulfillmentMethod] = useState<"delivery" | "pickup">("delivery");

  const unitPrice = meal.sizes.find((size) => size.label === sizeLabel)?.price ?? meal.price;
  const total = unitPrice * quantity;
  const soldOut = !meal.isAvailable || meal.quantityAvailable <= 0;

  if (soldOut) {
    return (
      <p className="rounded-2xl border border-sand bg-surface p-4 text-sm text-espresso-muted">
        This meal is currently sold out. Please check back soon or browse other dishes.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5 rounded-2xl border border-sand bg-surface p-5">
      <h2 className="font-heading text-lg font-semibold text-espresso">Place your order</h2>

      {meal.sizes.length > 0 ? (
        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-semibold text-espresso">Size</legend>
          <div className="flex flex-wrap gap-2">
            {meal.sizes.map((size) => (
              <label
                key={size.label}
                className={cn(
                  "cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  sizeLabel === size.label
                    ? "border-paprika bg-paprika text-white"
                    : "border-sand text-espresso-muted hover:border-paprika hover:text-paprika"
                )}
              >
                <input
                  type="radio"
                  name="sizeLabel"
                  value={size.label}
                  checked={sizeLabel === size.label}
                  onChange={() => setSizeLabel(size.label)}
                  className="sr-only"
                />
                {size.label} &middot; {formatGHS(size.price)}
              </label>
            ))}
          </div>
          {state?.errors?.sizeLabel && <p className="text-xs text-brick">{state.errors.sizeLabel[0]}</p>}
        </fieldset>
      ) : (
        <input type="hidden" name="sizeLabel" value="Regular" />
      )}

      <div>
        <label htmlFor="quantity" className="text-sm font-semibold text-espresso">
          Quantity
        </label>
        <div className="mt-2 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-sand text-espresso hover:border-paprika hover:text-paprika"
            aria-label="Decrease quantity"
          >
            &minus;
          </button>
          <input
            id="quantity"
            name="quantity"
            type="number"
            min={1}
            max={20}
            value={quantity}
            onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
            className="w-14 rounded-lg border border-sand bg-cream py-1.5 text-center text-espresso"
          />
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(20, q + 1))}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-sand text-espresso hover:border-paprika hover:text-paprika"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        {state?.errors?.quantity && <p className="mt-1 text-xs text-brick">{state.errors.quantity[0]}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="customerName" className="text-sm font-semibold text-espresso">
            Your name
          </label>
          <input
            id="customerName"
            name="customerName"
            type="text"
            placeholder="e.g. Ama Owusu"
            className="mt-2 w-full rounded-lg border border-sand bg-cream px-3 py-2 text-sm text-espresso outline-none focus:border-paprika"
          />
          {state?.errors?.customerName && <p className="mt-1 text-xs text-brick">{state.errors.customerName[0]}</p>}
        </div>
        <div>
          <label htmlFor="customerPhone" className="text-sm font-semibold text-espresso">
            Contact number
          </label>
          <input
            id="customerPhone"
            name="customerPhone"
            type="tel"
            placeholder="e.g. 024 000 0000"
            className="mt-2 w-full rounded-lg border border-sand bg-cream px-3 py-2 text-sm text-espresso outline-none focus:border-paprika"
          />
          {state?.errors?.customerPhone && <p className="mt-1 text-xs text-brick">{state.errors.customerPhone[0]}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="customerEmail" className="text-sm font-semibold text-espresso">
          Email <span className="font-normal text-espresso-muted">(optional)</span>
        </label>
        <input
          id="customerEmail"
          name="customerEmail"
          type="email"
          placeholder="e.g. ama@example.com"
          className="mt-2 w-full rounded-lg border border-sand bg-cream px-3 py-2 text-sm text-espresso outline-none focus:border-paprika"
        />
        <p className="mt-1 text-xs text-espresso-muted">
          Add your email to get order updates as we confirm, prepare, and deliver your food.
        </p>
        {state?.errors?.customerEmail && <p className="mt-1 text-xs text-brick">{state.errors.customerEmail[0]}</p>}
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-semibold text-espresso">How would you like to receive it?</legend>
        <div className="flex gap-2">
          {(["delivery", "pickup"] as const).map((method) => (
            <label
              key={method}
              className={cn(
                "cursor-pointer rounded-full border px-4 py-2 text-sm font-medium capitalize transition-colors",
                fulfillmentMethod === method
                  ? "border-paprika bg-paprika text-white"
                  : "border-sand text-espresso-muted hover:border-paprika hover:text-paprika"
              )}
            >
              <input
                type="radio"
                name="fulfillmentMethod"
                value={method}
                checked={fulfillmentMethod === method}
                onChange={() => setFulfillmentMethod(method)}
                className="sr-only"
              />
              {method}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="location" className="text-sm font-semibold text-espresso">
          {fulfillmentMethod === "delivery" ? "Delivery address" : "Pickup location note"}
        </label>
        <input
          id="location"
          name="location"
          type="text"
          placeholder={
            fulfillmentMethod === "delivery"
              ? "House number, street, landmark, area"
              : "e.g. I'll come pick it up myself around 2pm"
          }
          className="mt-2 w-full rounded-lg border border-sand bg-cream px-3 py-2 text-sm text-espresso outline-none focus:border-paprika"
        />
        {state?.errors?.location && <p className="mt-1 text-xs text-brick">{state.errors.location[0]}</p>}
      </div>

      <div>
        <label htmlFor="expectedDate" className="text-sm font-semibold text-espresso">
          Expected day
        </label>
        <input
          id="expectedDate"
          name="expectedDate"
          type="date"
          min={todayISODate()}
          className="mt-2 w-full rounded-lg border border-sand bg-cream px-3 py-2 text-sm text-espresso outline-none focus:border-paprika"
        />
        {state?.errors?.expectedDate && <p className="mt-1 text-xs text-brick">{state.errors.expectedDate[0]}</p>}
      </div>

      <div>
        <label htmlFor="notes" className="text-sm font-semibold text-espresso">
          Notes <span className="font-normal text-espresso-muted">(optional)</span>
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={2}
          placeholder="Any special instructions?"
          className="mt-2 w-full resize-none rounded-lg border border-sand bg-cream px-3 py-2 text-sm text-espresso outline-none focus:border-paprika"
        />
      </div>

      <div className="flex items-center justify-between border-t border-sand pt-4">
        <span className="text-sm text-espresso-muted">
          Total ({quantity} &times; {formatGHS(unitPrice)})
        </span>
        <span className="font-heading text-lg font-semibold text-paprika">{formatGHS(total)}</span>
      </div>

      {state?.message && <p className="text-sm text-brick">{state.message}</p>}

      <Button type="submit" variant="primary" disabled={pending} className="w-full justify-center">
        {pending ? "Placing order..." : "Place order"}
      </Button>
    </form>
  );
}
