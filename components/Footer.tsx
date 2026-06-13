"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Globe, MessageCircle, AtSign, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-slate-50">
      {/* Newsletter */}
      <div className="border-b bg-slate-100">
        <div className="container mx-auto px-4 py-8 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div>
              <h3 className="text-lg font-semibold">Subscribe to our newsletter</h3>
              <p className="text-sm text-muted-foreground">
                Get the latest deals and fitness tips delivered to your inbox.
              </p>
            </div>
            <form className="flex w-full max-w-sm gap-2" onSubmit={(e) => e.preventDefault()}>
              <Input type="email" placeholder="your@email.com" />
              <Button type="submit">Subscribe</Button>
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-10 w-10">
                <Image
                  src="/WhatsApp Image 2026-06-13 at 11.08.23.jpeg"
                  alt="Fest Fit Supplements Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold">Fest Fit</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Premium supplements to fuel your fitness journey. Quality ingredients,
              real results.
            </p>
            <div className="flex gap-3">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Globe className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <MessageCircle className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <AtSign className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/products" className="hover:text-primary transition-colors">Shop All</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-3">Categories</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/products?category=Protein" className="hover:text-primary transition-colors">Protein</Link></li>
              <li><Link href="/products?category=Pre-Workout" className="hover:text-primary transition-colors">Pre-Workout</Link></li>
              <li><Link href="/products?category=Vitamins" className="hover:text-primary transition-colors">Vitamins</Link></li>
              <li><Link href="/products?category=Weight+Loss" className="hover:text-primary transition-colors">Weight Loss</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-3">Contact</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                support@festfit.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Lagos, Nigeria
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Fest Fit Supplements. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
