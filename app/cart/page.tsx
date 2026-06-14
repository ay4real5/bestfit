"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/CartProvider";
import { getPromoCode } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Tag,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/currency";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, subtotal, clearCart } = useCart();
  const [promoInput, setPromoInput] = useState("");
  const [promoApplied, setPromoApplied] = useState<{ code: string; discount: number } | null>(null);

  const shipping = subtotal >= 50000 ? 0 : 3000;
  const discount = promoApplied ? promoApplied.discount : 0;
  const total = Math.max(0, subtotal + shipping - discount);

  const applyPromo = () => {
    const promo = getPromoCode(promoInput);
    if (!promo) {
      toast.error("Invalid promo code");
      return;
    }
    const discountAmount = promo.type === "percent" ? subtotal * (promo.discount / 100) : promo.discount;
    setPromoApplied({ code: promo.code, discount: discountAmount });
    toast.success(`Promo code ${promo.code} applied!`);
  };

  const removePromo = () => {
    setPromoApplied(null);
    setPromoInput("");
    toast.info("Promo code removed");
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-32 text-center md:px-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-stone-100 mb-8">
          <ShoppingBag className="h-10 w-10 text-stone-300" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">Your cart is empty</h1>
        <p className="mt-3 max-w-md text-stone-500">
          Looks like you haven't added anything to your cart yet. Explore our collection and find something you'll love.
        </p>
        <Link
          href="/products"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90"
        >
          Start Shopping <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <div className="mb-10">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">Cart</span>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 md:text-4xl">Shopping Cart</h1>
        <p className="mt-2 text-stone-500">{items.reduce((sum, i) => sum + i.quantity, 0)} items in your cart</p>
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-5">
          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="flex gap-5 rounded-2xl border border-stone-100 bg-white p-5 transition-all hover:border-stone-200 hover:shadow-sm"
            >
              <Link href={`/products/${product.slug}`} className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-stone-100">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </Link>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <Link
                    href={`/products/${product.slug}`}
                    className="text-[15px] font-semibold text-stone-900 hover:text-primary transition-colors"
                  >
                    {product.name}
                  </Link>
                  <p className="mt-0.5 text-sm text-stone-400">{product.category}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-xl border border-stone-200 bg-white">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="flex h-9 w-9 items-center justify-center rounded-l-xl text-stone-500 transition-colors hover:bg-stone-50"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold text-stone-900">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="flex h-9 w-9 items-center justify-center rounded-r-xl text-stone-500 transition-colors hover:bg-stone-50"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold text-stone-900">{formatPrice(product.price * quantity)}</span>
                    <button
                      type="button"
                      className="flex h-9 w-9 items-center justify-center rounded-full text-stone-400 transition-colors hover:bg-red-50 hover:text-red-500"
                      onClick={() => removeFromCart(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-between pt-4">
            <button
              type="button"
              className="text-sm font-medium text-stone-500 transition-colors hover:text-stone-900"
              onClick={clearCart}
            >
              Clear Cart
            </button>
            <Link
              href="/products"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Summary */}
        <div>
          <div className="sticky top-24 rounded-2xl border border-stone-100 bg-white p-6">
            <h2 className="text-lg font-semibold text-stone-900">Order Summary</h2>
            <div className="my-5 h-px bg-stone-100" />
            <div className="space-y-4">
              <div className="flex justify-between text-[15px]">
                <span className="text-stone-500">Subtotal</span>
                <span className="font-medium text-stone-900">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[15px]">
                <span className="text-stone-500">Shipping</span>
                <span className="font-medium text-stone-900">
                  {shipping === 0 ? (
                    <span className="text-primary">Free</span>
                  ) : (
                    formatPrice(shipping)
                  )}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-stone-400">
                  Add {formatPrice(50000 - subtotal)} more for free shipping!
                </p>
              )}
              {promoApplied && (
                <div className="flex justify-between text-[15px] text-primary">
                  <span>Discount ({promoApplied.code})</span>
                  <span className="font-medium">-{formatPrice(promoApplied.discount)}</span>
                </div>
              )}
              <div className="my-4 h-px bg-stone-100" />
              <div className="flex justify-between text-lg font-bold text-stone-900">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            {/* Promo Code */}
            {!promoApplied ? (
              <div className="mt-6 space-y-3">
                <label className="text-sm font-medium text-stone-700">Promo Code</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter code"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="rounded-xl border-stone-200 text-sm"
                  />
                  <button
                    type="button"
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-stone-200 px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50"
                    onClick={applyPromo}
                  >
                    <Tag className="h-3.5 w-3.5" /> Apply
                  </button>
                </div>
                <p className="text-xs text-stone-400">Try FEST10 for 10% off</p>
              </div>
            ) : (
              <div className="mt-6 flex items-center justify-between rounded-xl bg-primary/5 px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-primary">
                  <Check className="h-4 w-4" />
                  <span className="font-medium">Code {promoApplied.code} applied</span>
                </div>
                <button
                  type="button"
                  className="text-sm font-medium text-stone-500 transition-colors hover:text-stone-900"
                  onClick={removePromo}
                >
                  Remove
                </button>
              </div>
            )}

            <Link
              href="/checkout"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-primary/40"
            >
              Checkout <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
