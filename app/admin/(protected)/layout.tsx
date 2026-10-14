import { redirect } from "next/navigation";
import { createClient, hasSupabaseConfig } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!hasSupabaseConfig()) {
    return <main className="flex-1 p-4 sm:p-8">{children}</main>;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  return (
    <div className="flex min-h-screen flex-col bg-cream sm:flex-row">
      <AdminSidebar email={user.email ?? ""} />
      <main className="flex-1 p-4 sm:p-8">{children}</main>
    </div>
  );
}
