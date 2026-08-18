import Link from "next/link";
import { Button } from "@/components/ui/Button";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/contact", label: "Contact Us" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-sand bg-cream/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-heading text-xl font-semibold tracking-tight text-espresso">
            Nududu <span className="text-paprika">by Dzie</span>
          </span>
        </Link>
        <div className="flex flex-wrap items-center gap-4 sm:gap-8">
          <nav className="flex items-center gap-4 sm:gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-espresso-muted transition-colors hover:text-paprika"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Button href="/menu" variant="primary" className="px-5 py-2.5 text-sm">
            Place an Order
          </Button>
        </div>
      </div>
    </header>
  );
}
