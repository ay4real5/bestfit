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
  const { items, updateQuantity, removeFromCart, subtotal, clearCart, promo, applyPromo, removePromo, discount, total } = useCart();
  const [promoInput, setPromoInput] = useState("");

  const qualifiesForFreeDelivery = subtotal >= 100000;
  const shipping = qualifiesForFreeDelivery ? 0 : null;

  const handleApplyPromo = () => {
    const promoCode = getPromoCode(promoInput);
    if (!promoCode) {
      toast.error("Invalid promo code");
      return;
    }
    const discountAmount = promoCode.type === "percent" ? subtotal * (promoCode.discount / 100) : promoCode.discount;
    applyPromo({ code: promoCode.code, discount: discountAmount });
    toast.success(`Promo code ${promoCode.code} applied!`);
  };

  const handleRemovePromo = () => {
    removePromo();
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
              className="flex gap-4 rounded-2xl border border-stone-100 bg-white p-4 transition-all hover:border-stone-200 hover:shadow-sm"
            >
              <Link href={`/products/${product.slug}`} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white border border-stone-100">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-1"
                />
              </Link>
              <div className="flex flex-1 flex-col justify-between min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <Link
                      href={`/products/${product.slug}`}
                      className="text-[14px] font-semibold text-stone-900 hover:text-primary transition-colors line-clamp-2"
                    >
                      {product.name}
                    </Link>
                    <p className="mt-0.5 text-xs text-stone-400">{product.category}</p>
                  </div>
                  <button
                    type="button"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-stone-400 transition-colors hover:bg-red-50 hover:text-red-500"
                    onClick={() => removeFromCart(product.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center rounded-xl border border-stone-200 bg-white">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-l-xl text-stone-500 transition-colors hover:bg-stone-50"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-7 text-center text-sm font-semibold text-stone-900">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-r-xl text-stone-500 transition-colors hover:bg-stone-50"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <span className="text-base font-bold text-stone-900">{formatPrice(product.price * quantity)}</span>
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
                    <span className="text-stone-500">Calculated at checkout</span>
                  )}
                </span>
              </div>
              {!qualifiesForFreeDelivery && (
                <p className="text-xs text-stone-400">
                  Add {formatPrice(100000 - subtotal)} more for free delivery, or enter your city at checkout for the exact price.
                </p>
              )}
              {promo && (
                <div className="flex justify-between text-[15px] text-primary">
                  <span>Discount ({promo.code})</span>
                  <span className="font-medium">-{formatPrice(promo.discount)}</span>
                </div>
              )}
              <div className="my-4 h-px bg-stone-100" />
              <div className="flex justify-between text-lg font-bold text-stone-900">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            {/* Promo Code */}
            {!promo ? (
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
                    onClick={handleApplyPromo}
                  >
                    <Tag className="h-3.5 w-3.5" /> Apply
                  </button>
                </div>
                <p className="text-xs text-stone-400">Try <strong>FEST10</strong> for 10% off or <strong>WELCOME</strong> for ₦2,000 off</p>
              </div>
            ) : (
              <div className="mt-6 flex items-center justify-between rounded-xl bg-primary/5 px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-primary">
                  <Check className="h-4 w-4" />
                  <span className="font-medium">Code {promo.code} applied</span>
                </div>
                <button
                  type="button"
                  className="text-sm font-medium text-stone-500 transition-colors hover:text-stone-900"
                  onClick={handleRemovePromo}
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
