"use client";

import Link from "next/link";
import Image from "next/image";
import { Globe, MessageCircle, AtSign, Mail, Phone, MapPin, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-white">
      {/* Newsletter */}
      <div className="border-b border-stone-100 bg-stone-50">
        <div className="container mx-auto px-4 py-14 md:px-6">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="max-w-md">
              <h3 className="text-2xl font-semibold tracking-tight text-stone-900">Stay in the loop</h3>
              <p className="mt-2 text-stone-500">
                Get the latest deals, new arrivals, and fitness tips delivered to your inbox.
              </p>
            </div>
            <form className="flex w-full max-w-md gap-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 rounded-full border border-stone-200 bg-white px-5 py-3 text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-stone-800 hover:shadow-lg"
              >
                Subscribe <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 md:px-6">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative h-10 w-10">
                <Image
                  src="/WhatsApp Image 2026-06-13 at 11.08.23.jpeg"
                  alt="Fest Fit Supplements Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold tracking-tight text-stone-900">Fest Fit</span>
            </Link>
            <p className="max-w-sm text-[15px] leading-relaxed text-stone-500">
              Premium supplements crafted to fuel your fitness journey. Quality ingredients, rigorous testing, real results.
            </p>
            <div className="flex gap-3">
              {[Globe, MessageCircle, AtSign].map((Icon, i) => (
                <Link
                  key={i}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 text-stone-400 transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                >
                  <Icon className="h-[18px] w-[18px]" />
                </Link>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="mb-5 text-sm font-semibold uppercase tracking-wider text-stone-900">Shop</h4>
            <ul className="space-y-3">
              {["All Products", "Protein", "Pre-Workout", "Vitamins", "Weight Loss"].map((item) => (
                <li key={item}>
                  <Link
                    href={item === "All Products" ? "/products" : `/products?category=${encodeURIComponent(item)}`}
                    className="text-[15px] text-stone-500 transition-colors hover:text-stone-900"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-5 text-sm font-semibold uppercase tracking-wider text-stone-900">Support</h4>
            <ul className="space-y-3">
              {["FAQ", "Contact", "Shipping", "Returns"].map((item) => (
                <li key={item}>
                  <Link
                    href={item === "Contact" ? "/contact" : item === "FAQ" ? "/faq" : "#"}
                    className="text-[15px] text-stone-500 transition-colors hover:text-stone-900"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-5 text-sm font-semibold uppercase tracking-wider text-stone-900">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-primary" />
                <span className="text-[15px] text-stone-500">support@festfit.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-primary" />
                <span className="text-[15px] text-stone-500">+234 812 345 6789</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                <span className="text-[15px] text-stone-500">Lagos, Nigeria</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-stone-100 pt-8 md:flex-row">
          <p className="text-sm text-stone-400">
            &copy; {new Date().getFullYear()} Fest Fit Supplements. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-stone-400">
            <Link href="#" className="hover:text-stone-600 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-stone-600 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
