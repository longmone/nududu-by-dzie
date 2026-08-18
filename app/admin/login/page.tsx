import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Admin Login | Nududu by Dzie",
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <span className="font-heading text-xl font-semibold text-espresso">
            Nududu <span className="text-paprika">by Dzie</span>
          </span>
          <p className="mt-1 text-sm text-espresso-muted">Admin dashboard</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
