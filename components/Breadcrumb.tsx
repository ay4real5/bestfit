"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

const pathMap: Record<string, string> = {
  products: "Shop",
  cart: "Cart",
  checkout: "Checkout",
  contact: "Contact",
  faq: "FAQ",
  admin: "Admin",
  dashboard: "Dashboard",
  login: "Login",
  orders: "Orders",
};

export default function Breadcrumb() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav className="container mx-auto px-4 py-3 md:px-6">
      <ol className="flex items-center gap-2 text-sm text-muted-foreground">
        <li>
          <Link href="/" className="flex items-center gap-1 hover:text-primary transition-colors">
            <Home className="h-3.5 w-3.5" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {segments.map((segment, i) => {
          const href = "/" + segments.slice(0, i + 1).join("/");
          const isLast = i === segments.length - 1;
          const label = pathMap[segment] || decodeURIComponent(segment);

          return (
            <li key={segment + i} className="flex items-center gap-2">
              <ChevronRight className="h-3.5 w-3.5" />
              {isLast ? (
                <span className="font-medium text-foreground">{label}</span>
              ) : (
                <Link href={href} className="hover:text-primary transition-colors">
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
