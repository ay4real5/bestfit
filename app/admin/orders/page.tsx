"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Package, Eye, CreditCard, Building2 } from "lucide-react";
import { formatPrice } from "@/lib/currency";
import { toast } from "sonner";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface StoredOrder {
  id: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCost: number;
  total: number;
  status: string;
  customerEmail: string;
  customerName: string;
  address: string;
  city: string;
  phone: string;
  deliveryMethod: "pickup" | "delivery";
  paymentMethod: "bank_transfer" | "card";
  proofOfPayment?: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  awaiting_payment: "bg-orange-100 text-orange-800",
  paid: "bg-green-100 text-green-800",
};

function StatusBadge({ status }: { status: string }) {
  const cls = statusColors[status] || "bg-stone-100 text-stone-800";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${cls}`}>
      {status.replace("_", " ")}
    </span>
  );
}

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<StoredOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("festfit_admin")) {
      router.push("/admin/login");
    }
  }, [router]);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.map((o: Record<string, unknown>) => ({
          id: o.id,
          items: typeof o.items === "string" ? JSON.parse(o.items) : o.items,
          subtotal: Number(o.subtotal),
          deliveryCost: Number(o.delivery_cost ?? o.deliveryCost ?? 0),
          total: Number(o.total),
          status: o.status,
          customerEmail: o.customer_email ?? o.customerEmail,
          customerName: o.customer_name ?? o.customerName,
          address: o.address,
          city: o.city,
          phone: o.phone,
          deliveryMethod: o.delivery_method ?? o.deliveryMethod,
          paymentMethod: o.payment_method ?? o.paymentMethod,
          proofOfPayment: o.proof_of_payment ?? o.proofOfPayment,
          createdAt: o.created_at ?? o.createdAt,
        })));
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update order");
      toast.success(`Order ${orderId} marked as ${status}`);
      await fetchOrders();
    } catch (err) {
      toast.error("Failed to update order status");
    }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="mb-10">
        <button
          onClick={() => router.push("/admin/dashboard")}
          className="mb-2 inline-flex items-center gap-1 text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </button>
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 md:text-4xl">Orders</h1>
        <p className="mt-2 text-stone-500">Manage customer orders</p>
      </div>

      <div className="mb-8 grid gap-5 sm:grid-cols-4">
        {[
          { label: "Total Orders", value: orders.length, icon: Package, color: "bg-blue-50 text-blue-600" },
          { label: "Total Revenue", value: formatPrice(totalRevenue), icon: () => <span className="text-lg font-bold text-stone-400">₦</span>, color: "bg-emerald-50 text-emerald-600" },
          { label: "Awaiting Payment", value: orders.filter((o) => o.status === "awaiting_payment").length, icon: Building2, color: "bg-amber-50 text-amber-600" },
          { label: "Pending", value: orders.filter((o) => o.status === "pending").length, icon: Package, color: "bg-violet-50 text-violet-600" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-stone-100 bg-white p-5 transition-all hover:border-stone-200 hover:shadow-lg hover:shadow-stone-200/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-stone-500">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold text-stone-900">{stat.value}</p>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}>
                {typeof stat.icon === "function" && stat.icon.length === 0 ? <stat.icon /> : <stat.icon className="h-4 w-4" />}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-stone-200 bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-stone-900">{selectedOrder.id}</h2>
              <button onClick={() => setSelectedOrder(null)} className="flex h-8 w-8 items-center justify-center rounded-full text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900">
                ✕
              </button>
            </div>

            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-stone-500">Customer</p>
                  <p className="font-medium text-stone-900">{selectedOrder.customerName}</p>
                  <p className="text-sm text-stone-600">{selectedOrder.customerEmail}</p>
                  <p className="text-sm text-stone-600">{selectedOrder.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-stone-500">Delivery</p>
                  <p className="font-medium text-stone-900 capitalize">{selectedOrder.deliveryMethod}</p>
                  {selectedOrder.deliveryMethod === "delivery" && (
                    <p className="text-sm text-stone-600">{selectedOrder.address}, {selectedOrder.city}</p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm text-stone-500">Payment</p>
                <p className="font-medium text-stone-900 capitalize">{selectedOrder.paymentMethod.replace("_", " ")}</p>
              </div>

              <div>
                <p className="text-sm text-stone-500 mb-2">Items</p>
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex justify-between py-1 text-sm text-stone-600">
                    <span>{item.quantity}x {item.name}</span>
                    <span className="font-medium text-stone-900">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="mt-3 border-t border-stone-100 pt-3 text-sm space-y-1">
                  <div className="flex justify-between text-stone-500"><span>Subtotal</span><span className="font-medium text-stone-700">{formatPrice(selectedOrder.subtotal)}</span></div>
                  <div className="flex justify-between text-stone-500"><span>Delivery</span><span className="font-medium text-stone-700">{formatPrice(selectedOrder.deliveryCost)}</span></div>
                  <div className="flex justify-between font-bold text-stone-900"><span>Total</span><span>{formatPrice(selectedOrder.total)}</span></div>
                </div>
              </div>

              {selectedOrder.proofOfPayment && (
                <div>
                  <p className="text-sm text-stone-500 mb-2">Proof of Payment</p>
                  <img src={selectedOrder.proofOfPayment} alt="Proof" className="max-h-64 rounded-xl border border-stone-200" />
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-2">
                <p className="w-full text-sm font-medium text-stone-700 mb-1">Update Status:</p>
                {["awaiting_payment", "paid", "processing", "shipped", "delivered", "cancelled"].map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(selectedOrder.id, s)}
                    className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                      selectedOrder.status === s
                        ? "bg-primary text-white"
                        : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                    }`}
                  >
                    {s.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-stone-100 bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-stone-50 hover:bg-stone-50">
              <TableHead className="text-stone-700">Order ID</TableHead>
              <TableHead className="text-stone-700">Customer</TableHead>
              <TableHead className="text-stone-700">Date</TableHead>
              <TableHead className="text-stone-700">Total</TableHead>
              <TableHead className="text-stone-700">Payment</TableHead>
              <TableHead className="text-stone-700">Status</TableHead>
              <TableHead className="text-stone-700">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} className="hover:bg-stone-50/50">
                <TableCell className="font-mono text-sm font-medium text-stone-900">{order.id}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-stone-900">{order.customerName}</p>
                    <p className="text-xs text-stone-500">{order.customerEmail}</p>
                  </div>
                </TableCell>
                <TableCell className="text-stone-600">{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="font-medium text-stone-900">{formatPrice(order.total)}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1 text-xs text-stone-600 capitalize">
                    {order.paymentMethod === "bank_transfer" ? <Building2 className="h-3 w-3" /> : <CreditCard className="h-3 w-3" />}
                    {order.paymentMethod.replace("_", " ")}
                  </span>
                </TableCell>
                <TableCell>
                  <StatusBadge status={order.status} />
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-stone-600 transition-colors hover:bg-stone-100"
                  >
                    <Eye className="h-3 w-3" /> View
                  </button>
                </TableCell>
              </TableRow>
            ))}
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-stone-400">
                  {loading ? "Loading orders..." : "No orders yet."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
