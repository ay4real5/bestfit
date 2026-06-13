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

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, subtotal, clearCart } = useCart();
  const [promoInput, setPromoInput] = useState("");
  const [promoApplied, setPromoApplied] = useState<{ code: string; discount: number } | null>(null);

  const shipping = subtotal >= 50 ? 0 : 5.99;
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
      <div className="container mx-auto px-4 py-20 text-center md:px-6">
        <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">
          Looks like you have not added anything yet.
        </p>
        <Link href="/products">
          <Button className="mt-6">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Shopping Cart</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => (
            <Card key={product.id}>
              <CardContent className="flex gap-4 p-4">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <Link
                      href={`/products/${product.slug}`}
                      className="font-semibold hover:text-primary transition-colors"
                    >
                      {product.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {product.category}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 rounded-lg border">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-l-lg hover:bg-muted transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-medium">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-r-lg hover:bg-muted transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold">
                        ${(product.price * quantity).toFixed(2)}
                      </span>
                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-slate-100 transition-colors"
                        onClick={() => removeFromCart(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-between">
            <button
              type="button"
              className="inline-flex items-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-slate-100 transition-colors"
              onClick={clearCart}
            >
              Clear Cart
            </button>
            <Link
              href="/products"
              className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-slate-100 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Summary */}
        <div>
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold">Order Summary</h2>
              <Separator className="my-4" />
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-600 font-medium">Free</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                  </p>
                )}
                {promoApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({promoApplied.code})</span>
                    <span>-${promoApplied.discount.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Promo Code */}
              {!promoApplied ? (
                <div className="mt-4 space-y-2">
                  <label className="text-xs font-medium">Promo Code</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter code"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="text-sm"
                    />
                    <button
                      type="button"
                      className="inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium hover:bg-slate-100 transition-colors"
                      onClick={applyPromo}
                    >
                      <Tag className="h-3 w-3 mr-1" /> Apply
                    </button>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Try FEST10 for 10% off</p>
                </div>
              ) : (
                <div className="mt-4 flex items-center justify-between rounded-lg bg-green-50 p-3">
                  <div className="flex items-center gap-2 text-green-600 text-sm">
                    <Check className="h-4 w-4" />
                    Code {promoApplied.code} applied
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-slate-100 transition-colors"
                    onClick={removePromo}
                  >
                    Remove
                  </button>
                </div>
              )}
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Link
                href="/checkout"
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-base font-medium text-white hover:bg-primary/90 transition-colors"
              >
                Checkout <ArrowRight className="h-4 w-4" />
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
