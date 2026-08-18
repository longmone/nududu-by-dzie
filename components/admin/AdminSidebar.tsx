"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/admin/login/actions";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/meals", label: "Meals" },
];

export function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex w-full shrink-0 flex-col justify-between border-sand bg-surface p-4 sm:h-screen sm:w-56 sm:border-r sm:p-6">
      <div>
        <Link href="/admin" className="font-heading text-lg font-semibold text-espresso">
          Nududu <span className="text-paprika">by Dzie</span>
        </Link>
        <nav className="mt-8 flex flex-row gap-1 sm:flex-col">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive ? "bg-paprika text-white" : "text-espresso-muted hover:bg-sand hover:text-espresso"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="mt-8 flex flex-col gap-2 border-t border-sand pt-4 sm:mt-0">
        <span className="truncate text-xs text-espresso-muted">{email}</span>
        <form action={signOut}>
          <button
            type="submit"
            className="text-sm font-medium text-espresso-muted transition-colors hover:text-paprika"
          >
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
