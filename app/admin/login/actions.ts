"use server";

import { redirect } from "next/navigation";
import { createClient, hasSupabaseConfig } from "@/lib/supabase/server";

export type LoginState = { message?: string } | undefined;

export async function signIn(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { message: "Please enter both email and password." };
  }

  if (!hasSupabaseConfig()) {
    return {
      message: "Authentication is unavailable because Supabase is not configured in this environment.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { message: "Invalid email or password." };
  }

  redirect("/admin");
}

export async function signOut() {
  if (!hasSupabaseConfig()) {
    redirect("/admin/login");
  }

  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
