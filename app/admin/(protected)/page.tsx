import Link from "next/link";
import type { Metadata } from "next";
import { getAllMealsAdmin } from "@/lib/data/meals";
import { getOrdersAdmin } from "@/lib/data/orders";

export const metadata: Metadata = {
  title: "Admin Dashboard | Nududu by Dzie",
};

export default async function AdminDashboardPage() {
  const [orders, meals] = await Promise.all([getOrdersAdmin(), getAllMealsAdmin()]);

  const newOrders = orders.filter((order) => order.status === "new").length;
  const soldOutMeals = meals.filter((meal) => !meal.isAvailable || meal.quantityAvailable <= 0).length;

  const stats = [
    { label: "New orders", value: newOrders, href: "/admin/orders" },
    { label: "Total orders", value: orders.length, href: "/admin/orders" },
    { label: "Meals on menu", value: meals.length, href: "/admin/meals" },
    { label: "Sold out meals", value: soldOutMeals, href: "/admin/meals" },
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-espresso">Dashboard</h1>
      <p className="mt-1 text-sm text-espresso-muted">A quick look at today&apos;s orders and menu.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-2xl border border-sand bg-surface p-5 transition-colors hover:border-paprika"
          >
            <p className="text-sm text-espresso-muted">{stat.label}</p>
            <p className="mt-2 font-heading text-3xl font-semibold text-espresso">{stat.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
