"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const shipping = subtotal >= 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    phone: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    clearCart();
    toast.success("Order placed successfully!");
  };

  if (items.length === 0 && !submitted) {
    return (
      <div className="container mx-auto px-4 py-20 text-center md:px-6">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">
          Add some items before checking out.
        </p>
        <Link href="/products">
          <Button className="mt-6">Browse Products</Button>
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-20 text-center md:px-6">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-6" />
        <h1 className="text-3xl font-bold">Thank you for your order!</h1>
        <p className="mt-4 max-w-md mx-auto text-muted-foreground">
          We have received your order and will send a confirmation email shortly.
          Your supplements will be on their way soon!
        </p>
        <Link href="/products">
          <Button className="mt-8">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <Link
        href="/cart"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to cart
      </Link>

      <h1 className="mb-8 text-3xl font-bold tracking-tight">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    required
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      required
                      value={form.city}
                      onChange={(e) =>
                        setForm({ ...form, city: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center rounded-lg bg-primary px-4 py-3 text-base font-medium text-white hover:bg-primary/90 transition-colors"
            >
              Place Order — ${total.toFixed(2)}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between text-sm">
                  <span>
                    {product.name} x{quantity}
                  </span>
                  <span className="font-medium">
                    ${(product.price * quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
