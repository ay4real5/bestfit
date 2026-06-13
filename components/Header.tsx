"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "./CartProvider";
import {
  ShoppingCart,
  Menu,
  X,
  Search,
  Heart,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useWishlist } from "./WishlistProvider";
import { useAuth } from "./AuthProvider";

export default function Header() {
  const { totalItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { isLoggedIn, customer } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Shop" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-16 w-16">
            <Image
              src="/WhatsApp Image 2026-06-13 at 11.08.23.jpeg"
              alt="Fest Fit Supplements Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-2xl font-bold tracking-tight text-foreground">
            Fest Fit
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/products"
            className="hidden md:flex h-9 w-9 items-center justify-center rounded-md hover:bg-slate-100 transition-colors"
          >
            <Search className="h-5 w-5 text-slate-600" />
          </Link>
          <Link
            href="/wishlist"
            className="relative hidden md:flex h-9 w-9 items-center justify-center rounded-md hover:bg-slate-100 transition-colors"
          >
            <Heart className="h-5 w-5 text-slate-600" />
            {wishlistCount > 0 && (
              <Badge
                variant="secondary"
                className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-[10px] flex items-center justify-center"
              >
                {wishlistCount}
              </Badge>
            )}
          </Link>

          <Link
            href="/cart"
            className="relative flex h-9 w-9 items-center justify-center rounded-md hover:bg-slate-100 transition-colors"
          >
            <ShoppingCart className="h-5 w-5 text-slate-600" />
            {totalItems > 0 && (
              <Badge
                variant="destructive"
                className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-[10px] flex items-center justify-center"
              >
                {totalItems}
              </Badge>
            )}
          </Link>

          {isLoggedIn ? (
            <Link
              href="/account"
              className="hidden md:flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium hover:bg-slate-100 transition-colors"
            >
              {customer?.name?.split(" ")[0] || "Account"}
            </Link>
          ) : (
            <Link
              href="/login"
              className="hidden md:flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium hover:bg-slate-100 transition-colors"
            >
              Login
            </Link>
          )}

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-slate-100 transition-colors">
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="flex flex-col gap-6 pt-8">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3"
                >
                  <div className="relative h-14 w-14">
                    <Image
                      src="/WhatsApp Image 2026-06-13 at 11.08.23.jpeg"
                      alt="Fest Fit Supplements Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-2xl font-bold">Fest Fit</span>
                </Link>
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="text-lg font-medium text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Link
                    href={isLoggedIn ? "/account" : "/login"}
                    onClick={() => setMobileOpen(false)}
                    className="text-lg font-medium text-muted-foreground transition-colors hover:text-primary"
                  >
                    {isLoggedIn ? "My Account" : "Login"}
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
