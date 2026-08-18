"use client";

import { useActionState } from "react";
import { signIn, type LoginState } from "@/app/admin/login/actions";
import { Button } from "@/components/ui/Button";

const initialState: LoginState = undefined;

export function LoginForm() {
  const [state, formAction, pending] = useActionState(signIn, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4 rounded-2xl border border-sand bg-surface p-6">
      <div>
        <label htmlFor="email" className="text-sm font-semibold text-espresso">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          className="mt-2 w-full rounded-lg border border-sand bg-cream px-3 py-2 text-sm text-espresso outline-none focus:border-paprika"
        />
      </div>
      <div>
        <label htmlFor="password" className="text-sm font-semibold text-espresso">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-2 w-full rounded-lg border border-sand bg-cream px-3 py-2 text-sm text-espresso outline-none focus:border-paprika"
        />
      </div>
      {state?.message && <p className="text-sm text-brick">{state.message}</p>}
      <Button type="submit" variant="primary" disabled={pending} className="w-full justify-center">
        {pending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
