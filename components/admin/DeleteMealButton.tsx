"use client";

import { useTransition } from "react";
import { deleteMealAction } from "@/app/admin/(protected)/meals/actions";

export function DeleteMealButton({ mealId, mealName }: { mealId: string; mealName: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm(`Delete "${mealName}"? This can't be undone.`)) {
          startTransition(() => deleteMealAction(mealId));
        }
      }}
      className="text-xs font-medium text-brick hover:underline disabled:opacity-50"
    >
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}
