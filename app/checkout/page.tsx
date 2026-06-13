"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { useAuth } from "@/components/AuthProvider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, ArrowLeft, Upload, Truck, MapPin, CreditCard, Building2 } from "lucide-react";
import { toast } from "sonner";

const BANK_DETAILS = {
  bankName: "First Bank of Nigeria",
  accountName: "Fest Fit Supplements Ltd",
  accountNumber: "0123456789",
};

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { customer, addOrder } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState("");

  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "delivery">("delivery");
  const [paymentMethod, setPaymentMethod] = useState<"bank_transfer" | "card">("bank_transfer");
  const [proofOfPayment, setProofOfPayment] = useState<string | null>(null);

  const deliveryCost = useMemo(() => {
    if (deliveryMethod === "pickup") return 0;
    return items.reduce((sum, { product, quantity }) => sum + (product.deliveryCost || 0) * quantity, 0);
  }, [deliveryMethod, items]);

  const total = subtotal + deliveryCost;

  const [form, setForm] = useState({
    name: customer?.name || "",
    email: customer?.email || "",
    address: customer?.address || "",
    city: customer?.city || "",
    phone: customer?.phone || "",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File must be under 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setProofOfPayment(reader.result as string);
      toast.success("Proof of payment uploaded");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === "bank_transfer" && !proofOfPayment) {
      toast.error("Please upload proof of payment for bank transfer");
      return;
    }

    const id = `ORD-${Date.now()}`;
    setOrderId(id);

    const order = {
      id,
      items: items.map(({ product, quantity }) => ({
        name: product.name,
        quantity,
        price: product.price,
      })),
      subtotal,
      deliveryCost,
      total,
      status: paymentMethod === "bank_transfer" ? "awaiting_payment" : "pending",
      customerEmail: form.email,
      customerName: form.name,
      address: form.address,
      city: form.city,
      phone: form.phone,
      deliveryMethod,
      paymentMethod,
      proofOfPayment: proofOfPayment || undefined,
      createdAt: new Date().toISOString(),
    };

    addOrder(order);
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
        <Link
          href="/products"
          className="mt-6 inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-20 text-center md:px-6">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-6" />
        <h1 className="text-3xl font-bold">Thank you for your order!</h1>
        <p className="mt-2 text-lg font-medium">{orderId}</p>
        <p className="mt-4 max-w-md mx-auto text-muted-foreground">
          {paymentMethod === "bank_transfer"
            ? "We have received your order and proof of payment. Our team will verify and process your order within 24 hours."
            : "We have received your order and will send a confirmation email shortly."}
        </p>
        {paymentMethod === "bank_transfer" && (
          <div className="mt-6 mx-auto max-w-md rounded-lg border bg-slate-50 p-4 text-sm text-left">
            <p className="font-semibold mb-2">Bank Transfer Details:</p>
            <p>Bank: {BANK_DETAILS.bankName}</p>
            <p>Account Name: {BANK_DETAILS.accountName}</p>
            <p>Account Number: {BANK_DETAILS.accountNumber}</p>
          </div>
        )}
        <Link
          href="/products"
          className="mt-8 inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
        >
          Continue Shopping
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
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" required={deliveryMethod === "delivery"} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" required={deliveryMethod === "delivery"} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                </div>
              </CardContent>
            </Card>

            {/* Delivery Method */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <label className={`flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition-colors ${deliveryMethod === "delivery" ? "border-primary bg-primary/5" : "hover:bg-slate-50"}`}>
                  <input type="radio" name="delivery" value="delivery" checked={deliveryMethod === "delivery"} onChange={() => setDeliveryMethod("delivery")} className="h-4 w-4" />
                  <Truck className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-medium">Home Delivery</p>
                    <p className="text-sm text-muted-foreground">We deliver to your doorstep</p>
                  </div>
                  <span className="text-sm font-medium">
                    {deliveryCost === 0 ? "Free" : `$${deliveryCost.toFixed(2)}`}
                  </span>
                </label>
                <label className={`flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition-colors ${deliveryMethod === "pickup" ? "border-primary bg-primary/5" : "hover:bg-slate-50"}`}>
                  <input type="radio" name="delivery" value="pickup" checked={deliveryMethod === "pickup"} onChange={() => setDeliveryMethod("pickup")} className="h-4 w-4" />
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-medium">Pickup</p>
                    <p className="text-sm text-muted-foreground">Collect from our store</p>
                  </div>
                  <span className="text-sm font-medium text-green-600">Free</span>
                </label>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <label className={`flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition-colors ${paymentMethod === "bank_transfer" ? "border-primary bg-primary/5" : "hover:bg-slate-50"}`}>
                  <input type="radio" name="payment" value="bank_transfer" checked={paymentMethod === "bank_transfer"} onChange={() => setPaymentMethod("bank_transfer")} className="h-4 w-4" />
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-medium">Bank Transfer</p>
                    <p className="text-sm text-muted-foreground">Pay via bank transfer and upload proof</p>
                  </div>
                </label>
                <label className={`flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition-colors ${paymentMethod === "card" ? "border-primary bg-primary/5" : "hover:bg-slate-50"}`}>
                  <input type="radio" name="payment" value="card" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} className="h-4 w-4" />
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-medium">Card Payment</p>
                    <p className="text-sm text-muted-foreground">Pay securely with your debit/credit card (Paystack)</p>
                  </div>
                </label>
              </CardContent>
            </Card>

            {/* Bank Transfer Details */}
            {paymentMethod === "bank_transfer" && (
              <Card>
                <CardHeader>
                  <CardTitle>Bank Transfer Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg bg-slate-50 p-4 text-sm space-y-1">
                    <p><span className="font-medium">Bank:</span> {BANK_DETAILS.bankName}</p>
                    <p><span className="font-medium">Account Name:</span> {BANK_DETAILS.accountName}</p>
                    <p><span className="font-medium">Account Number:</span> {BANK_DETAILS.accountNumber}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Upload Proof of Payment</Label>
                    <div className="flex items-center gap-3">
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-dashed px-4 py-3 text-sm hover:bg-slate-50 transition-colors">
                        <Upload className="h-4 w-4" />
                        {proofOfPayment ? "Change file" : "Choose file"}
                        <input type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileChange} />
                      </label>
                      {proofOfPayment && (
                        <span className="text-sm text-green-600">Uploaded ✓</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">Upload screenshot or PDF of your transfer receipt (max 5MB)</p>
                    {proofOfPayment && (
                      <img src={proofOfPayment} alt="Proof of payment" className="mt-2 max-h-48 rounded-lg border" />
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

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
                  <span>{product.name} x{quantity}</span>
                  <span className="font-medium">${(product.price * quantity).toFixed(2)}</span>
                </div>
              ))}
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span>{deliveryCost === 0 ? "Free" : `$${deliveryCost.toFixed(2)}`}</span>
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
