"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { Package, User, MapPin, Phone, LogOut, ArrowLeft, Truck, CreditCard, Building2 } from "lucide-react";
import { toast } from "sonner";

export default function AccountPage() {
  const router = useRouter();
  const { customer, orders, logout, isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  if (!customer) return null;

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/");
  };

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to store
      </Link>

      <div className="mb-10 flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Account</span>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 md:text-4xl">My Account</h1>
          <p className="mt-2 text-stone-500">Welcome back, {customer.name}</p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-stone-200 px-5 py-2.5 text-sm font-medium text-stone-600 transition-all hover:bg-stone-50 hover:text-stone-900"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl border border-stone-100 bg-white p-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-stone-900">
              <User className="h-5 w-5 text-primary" /> Profile
            </h3>
            <div className="mt-5 space-y-4">
              <div className="flex items-center gap-3 text-[15px]">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-stone-500">
                  <User className="h-4 w-4" />
                </div>
                <span className="text-stone-700">{customer.name}</span>
              </div>
              <div className="flex items-center gap-3 text-[15px]">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-stone-500">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="text-stone-700">{customer.address || "Not set"}</span>
              </div>
              <div className="flex items-center gap-3 text-[15px]">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-stone-500">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="text-stone-700">{customer.city || "Not set"}</span>
              </div>
              <div className="flex items-center gap-3 text-[15px]">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-stone-500">
                  <Phone className="h-4 w-4" />
                </div>
                <span className="text-stone-700">{customer.phone || "Not set"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-stone-100 bg-white p-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-stone-900">
              <Package className="h-5 w-5 text-primary" /> Order History
            </h3>
            <div className="mt-5">
              {orders.length === 0 ? (
                <div className="flex flex-col items-center py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-stone-100 mb-4">
                    <Package className="h-8 w-8 text-stone-300" />
                  </div>
                  <p className="text-stone-500">No orders yet.</p>
                  <Link href="/products" className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90">
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-5">
                  {orders.map((order) => (
                    <div key={order.id} className="rounded-xl border border-stone-100 p-5 transition-all hover:border-stone-200">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-mono text-sm font-medium text-stone-900">{order.id}</p>
                          <p className="text-xs text-stone-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span className="inline-flex items-center rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700 capitalize">
                          {order.status.replace("_", " ")}
                        </span>
                      </div>
                      <div className="mb-3 flex flex-wrap gap-4 text-xs text-stone-500">
                        <span className="inline-flex items-center gap-1.5 capitalize">
                          <Truck className="h-3.5 w-3.5" /> {order.deliveryMethod}
                        </span>
                        <span className="inline-flex items-center gap-1.5 capitalize">
                          {order.paymentMethod === "bank_transfer" ? <Building2 className="h-3.5 w-3.5" /> : <CreditCard className="h-3.5 w-3.5" />}
                          {order.paymentMethod.replace("_", " ")}
                        </span>
                      </div>
                      <div className="space-y-1.5 text-sm">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between text-stone-500">
                            <span>{item.name} <span className="text-stone-400">x{item.quantity}</span></span>
                            <span className="font-medium text-stone-700">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="my-3 h-px bg-stone-100" />
                      <div className="space-y-1.5 text-sm">
                        <div className="flex justify-between text-stone-500">
                          <span>Subtotal</span>
                          <span className="font-medium text-stone-700">${order.subtotal?.toFixed(2) || order.total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-stone-500">
                          <span>Delivery</span>
                          <span className="font-medium text-stone-700">${order.deliveryCost?.toFixed(2) || "0.00"}</span>
                        </div>
                        <div className="flex justify-between font-bold text-stone-900">
                          <span>Total</span>
                          <span>${order.total.toFixed(2)}</span>
                        </div>
                      </div>
                      {order.proofOfPayment && (
                        <div className="mt-4">
                          <p className="text-xs font-medium text-stone-500 mb-2">Proof of Payment:</p>
                          <img src={order.proofOfPayment} alt="Proof" className="max-h-32 rounded-xl border border-stone-200" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
