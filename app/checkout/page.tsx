"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { useAuth } from "@/components/AuthProvider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, ArrowLeft, ArrowRight, Upload, Truck, MapPin, CreditCard, Building2, ShoppingBag } from "lucide-react";
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
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-32 text-center md:px-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-stone-100 mb-8">
          <ShoppingBag className="h-10 w-10 text-stone-300" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">Your cart is empty</h1>
        <p className="mt-3 max-w-md text-stone-500">Add some items before checking out.</p>
        <Link
          href="/products"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90"
        >
          Browse Products <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-24 text-center md:px-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 mb-8">
          <CheckCircle className="h-10 w-10 text-emerald-600" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">Order Confirmed</span>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-stone-900 md:text-4xl">Thank you for your order!</h1>
        <p className="mt-2 text-lg font-mono text-stone-500">{orderId}</p>
        <p className="mt-4 max-w-md text-stone-500 leading-relaxed">
          {paymentMethod === "bank_transfer"
            ? "We have received your order and proof of payment. Our team will verify and process your order within 24 hours."
            : "We have received your order and will send a confirmation email shortly."}
        </p>
        {paymentMethod === "bank_transfer" && (
          <div className="mt-8 mx-auto max-w-md rounded-2xl border border-stone-200 bg-stone-50 p-6 text-sm text-left">
            <p className="font-semibold mb-3 text-stone-900">Bank Transfer Details:</p>
            <div className="space-y-2 text-stone-600">
              <p><span className="font-medium text-stone-900">Bank:</span> {BANK_DETAILS.bankName}</p>
              <p><span className="font-medium text-stone-900">Account Name:</span> {BANK_DETAILS.accountName}</p>
              <p><span className="font-medium text-stone-900">Account Number:</span> {BANK_DETAILS.accountNumber}</p>
            </div>
          </div>
        )}
        <Link
          href="/products"
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90"
        >
          Continue Shopping <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <Link
        href="/cart"
        className="mb-8 inline-flex items-center gap-1 text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to cart
      </Link>

      <div className="mb-10">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">Secure Checkout</span>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 md:text-4xl">Checkout</h1>
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Info */}
            <div className="rounded-2xl border border-stone-100 bg-white p-6">
              <h3 className="text-lg font-semibold text-stone-900">Customer Information</h3>
              <div className="mt-5 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-stone-700">Full Name</Label>
                    <Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-xl border-stone-200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-stone-700">Email</Label>
                    <Input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-xl border-stone-200" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-stone-700">Phone</Label>
                  <Input id="phone" type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="rounded-xl border-stone-200" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium text-stone-700">Address {deliveryMethod === "pickup" && <span className="text-stone-400 font-normal">(optional)</span>}</Label>
                  <Input id="address" required={deliveryMethod === "delivery"} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="rounded-xl border-stone-200" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-medium text-stone-700">City {deliveryMethod === "pickup" && <span className="text-stone-400 font-normal">(optional)</span>}</Label>
                  <Input id="city" required={deliveryMethod === "delivery"} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="rounded-xl border-stone-200" />
                </div>
              </div>
            </div>

            {/* Delivery Method */}
            <div className="rounded-2xl border border-stone-100 bg-white p-6">
              <h3 className="text-lg font-semibold text-stone-900">Delivery Method</h3>
              <div className="mt-5 space-y-3">
                <label className={`flex items-center gap-4 rounded-xl border p-4 cursor-pointer transition-all ${deliveryMethod === "delivery" ? "border-primary bg-primary/[0.03] ring-1 ring-primary/20" : "border-stone-200 hover:bg-stone-50"}`}>
                  <input type="radio" name="delivery" value="delivery" checked={deliveryMethod === "delivery"} onChange={() => setDeliveryMethod("delivery")} className="h-4 w-4 accent-primary" />
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-stone-500">
                    <Truck className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-stone-900">Home Delivery</p>
                    <p className="text-sm text-stone-500">We deliver to your doorstep</p>
                  </div>
                  <span className="text-sm font-semibold text-stone-900">
                    {deliveryCost === 0 ? "Free" : `$${deliveryCost.toFixed(2)}`}
                  </span>
                </label>
                <label className={`flex items-center gap-4 rounded-xl border p-4 cursor-pointer transition-all ${deliveryMethod === "pickup" ? "border-primary bg-primary/[0.03] ring-1 ring-primary/20" : "border-stone-200 hover:bg-stone-50"}`}>
                  <input type="radio" name="delivery" value="pickup" checked={deliveryMethod === "pickup"} onChange={() => setDeliveryMethod("pickup")} className="h-4 w-4 accent-primary" />
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-stone-500">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-stone-900">Pickup</p>
                    <p className="text-sm text-stone-500">Collect from our store</p>
                  </div>
                  <span className="text-sm font-semibold text-primary">Free</span>
                </label>
              </div>
            </div>

            {/* Payment Method */}
            <div className="rounded-2xl border border-stone-100 bg-white p-6">
              <h3 className="text-lg font-semibold text-stone-900">Payment Method</h3>
              <div className="mt-5 space-y-3">
                <label className={`flex items-center gap-4 rounded-xl border p-4 cursor-pointer transition-all ${paymentMethod === "bank_transfer" ? "border-primary bg-primary/[0.03] ring-1 ring-primary/20" : "border-stone-200 hover:bg-stone-50"}`}>
                  <input type="radio" name="payment" value="bank_transfer" checked={paymentMethod === "bank_transfer"} onChange={() => setPaymentMethod("bank_transfer")} className="h-4 w-4 accent-primary" />
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-stone-500">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-stone-900">Bank Transfer</p>
                    <p className="text-sm text-stone-500">Pay via bank transfer and upload proof</p>
                  </div>
                </label>
                <label className={`flex items-center gap-4 rounded-xl border p-4 cursor-pointer transition-all ${paymentMethod === "card" ? "border-primary bg-primary/[0.03] ring-1 ring-primary/20" : "border-stone-200 hover:bg-stone-50"}`}>
                  <input type="radio" name="payment" value="card" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} className="h-4 w-4 accent-primary" />
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-stone-500">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-stone-900">Card Payment</p>
                    <p className="text-sm text-stone-500">Pay securely with your debit/credit card (Paystack)</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Bank Transfer Details */}
            {paymentMethod === "bank_transfer" && (
              <div className="rounded-2xl border border-stone-100 bg-white p-6">
                <h3 className="text-lg font-semibold text-stone-900">Bank Transfer Details</h3>
                <div className="mt-5 space-y-5">
                  <div className="rounded-xl bg-stone-50 p-5 text-sm space-y-2">
                    <p><span className="font-semibold text-stone-900">Bank:</span> <span className="text-stone-600">{BANK_DETAILS.bankName}</span></p>
                    <p><span className="font-semibold text-stone-900">Account Name:</span> <span className="text-stone-600">{BANK_DETAILS.accountName}</span></p>
                    <p><span className="font-semibold text-stone-900">Account Number:</span> <span className="text-stone-600">{BANK_DETAILS.accountNumber}</span></p>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-stone-700">Upload Proof of Payment</Label>
                    <div className="flex items-center gap-3">
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-stone-300 px-5 py-3 text-sm text-stone-600 hover:bg-stone-50 transition-colors">
                        <Upload className="h-4 w-4" />
                        {proofOfPayment ? "Change file" : "Choose file"}
                        <input type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileChange} />
                      </label>
                      {proofOfPayment && (
                        <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                          <CheckCircle className="h-4 w-4" /> Uploaded
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-400">Upload screenshot or PDF of your transfer receipt (max 5MB)</p>
                    {proofOfPayment && (
                      <img src={proofOfPayment} alt="Proof of payment" className="mt-2 max-h-48 rounded-xl border border-stone-200" />
                    )}
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-base font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-primary/40"
            >
              Place Order — ${total.toFixed(2)} <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <div className="sticky top-24 rounded-2xl border border-stone-100 bg-white p-6">
            <h2 className="text-lg font-semibold text-stone-900">Order Summary</h2>
            <div className="my-5 h-px bg-stone-100" />
            <div className="space-y-4">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between text-[15px]">
                  <span className="text-stone-600">{product.name} <span className="text-stone-400">x{quantity}</span></span>
                  <span className="font-medium text-stone-900">${(product.price * quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="my-5 h-px bg-stone-100" />
            <div className="space-y-3 text-[15px]">
              <div className="flex justify-between">
                <span className="text-stone-500">Subtotal</span>
                <span className="font-medium text-stone-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Delivery</span>
                <span className="font-medium text-stone-900">{deliveryCost === 0 ? <span className="text-primary">Free</span> : `$${deliveryCost.toFixed(2)}`}</span>
              </div>
            </div>
            <div className="my-5 h-px bg-stone-100" />
            <div className="flex justify-between text-lg font-bold text-stone-900">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
