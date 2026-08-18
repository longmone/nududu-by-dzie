import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-paprika text-white hover:bg-paprika-dark",
  secondary: "bg-surface text-espresso border border-sand hover:bg-sand",
  ghost: "bg-transparent text-espresso hover:bg-sand",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-sans text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50";

interface CommonProps {
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
}

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps & {
  href: string;
};

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = "primary", className, children, ...rest } = props;
  const classes = cn(baseClasses, variantClasses[variant], className);

  if ("href" in rest && rest.href) {
    const { href } = rest;
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
