"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "./CartProvider";
import {
  ShoppingCart,
  Menu,
  Search,
  Heart,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
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
    <header className="sticky top-0 z-50 w-full border-b border-stone-200 bg-white/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-[72px] items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative h-12 w-12">
            <Image
              src="/WhatsApp Image 2026-06-13 at 11.08.23.jpeg"
              alt="Fest Fit Supplements Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-xl font-bold tracking-tight text-stone-900">
            Fest Fit
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-stone-500 transition-colors hover:text-stone-900 relative after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Link
            href="/products"
            className="hidden md:flex h-10 w-10 items-center justify-center rounded-full text-stone-500 transition-all hover:bg-stone-100 hover:text-stone-900"
          >
            <Search className="h-[18px] w-[18px]" />
          </Link>
          <Link
            href="/wishlist"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-stone-500 transition-all hover:bg-stone-100 hover:text-stone-900"
          >
            <Heart className="h-[18px] w-[18px]" />
            {wishlistCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link
            href="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-stone-500 transition-all hover:bg-stone-100 hover:text-stone-900"
          >
            <ShoppingCart className="h-[18px] w-[18px]" />
            {totalItems > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                {totalItems}
              </span>
            )}
          </Link>

          {isLoggedIn ? (
            <Link
              href="/account"
              className="hidden md:ml-2 md:inline-flex h-9 items-center justify-center rounded-full bg-stone-900 px-4 text-sm font-medium text-white transition-all hover:bg-stone-800"
            >
              {customer?.name?.split(" ")[0] || "Account"}
            </Link>
          ) : (
            <Link
              href="/login"
              className="hidden md:ml-2 md:inline-flex h-9 items-center justify-center rounded-full border border-stone-200 px-4 text-sm font-medium text-stone-700 transition-all hover:border-stone-300 hover:bg-stone-50"
            >
              Login
            </Link>
          )}

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full text-stone-600 transition-colors hover:bg-stone-100">
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-80 border-l border-stone-200">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="flex flex-col gap-8 pt-10">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3"
                >
                  <div className="relative h-12 w-12">
                    <Image
                      src="/WhatsApp Image 2026-06-13 at 11.08.23.jpeg"
                      alt="Fest Fit Supplements Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-xl font-bold text-stone-900">Fest Fit</span>
                </Link>
                <nav className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="rounded-xl px-4 py-3 text-[15px] font-medium text-stone-600 transition-colors hover:bg-stone-50 hover:text-stone-900"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Link
                    href={isLoggedIn ? "/account" : "/login"}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-xl px-4 py-3 text-[15px] font-medium text-stone-600 transition-colors hover:bg-stone-50 hover:text-stone-900"
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
