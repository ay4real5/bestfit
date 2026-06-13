"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Package, Eye, Truck, CreditCard, Building2 } from "lucide-react";
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

const ALL_ORDERS_KEY = "festfit_all_orders";

function StatusBadge({ status }: { status: string }) {
  return (
    <Badge className={statusColors[status] || "bg-gray-100 text-gray-800"}>
      {status.replace("_", " ")}
    </Badge>
  );
}

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<StoredOrder | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("festfit_admin")) {
      router.push("/admin/login");
    }
  }, [router]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(ALL_ORDERS_KEY);
      if (saved) {
        try {
          setOrders(JSON.parse(saved));
        } catch {}
      }
    }
  }, []);

  const updateStatus = (orderId: string, status: string) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
    setOrders(updated);
    localStorage.setItem(ALL_ORDERS_KEY, JSON.stringify(updated));
    toast.success(`Order ${orderId} marked as ${status}`);
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="mb-8">
        <button
          onClick={() => router.push("/admin/dashboard")}
          className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </button>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">Manage customer orders</p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <span className="text-muted-foreground text-sm">$</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Awaiting Payment</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.filter((o) => o.status === "awaiting_payment").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.filter((o) => o.status === "pending").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">{selectedOrder.id}</h2>
              <button onClick={() => setSelectedOrder(null)} className="rounded-md p-1 hover:bg-slate-100">
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Customer</p>
                  <p className="font-medium">{selectedOrder.customerName}</p>
                  <p className="text-sm">{selectedOrder.customerEmail}</p>
                  <p className="text-sm">{selectedOrder.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Delivery</p>
                  <p className="font-medium capitalize">{selectedOrder.deliveryMethod}</p>
                  {selectedOrder.deliveryMethod === "delivery" && (
                    <p className="text-sm">{selectedOrder.address}, {selectedOrder.city}</p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Payment</p>
                <p className="font-medium capitalize">{selectedOrder.paymentMethod.replace("_", " ")}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Items</p>
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex justify-between py-1 text-sm">
                    <span>{item.quantity}x {item.name}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="mt-2 border-t pt-2 text-sm">
                  <div className="flex justify-between"><span>Subtotal</span><span>${selectedOrder.subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Delivery</span><span>${selectedOrder.deliveryCost.toFixed(2)}</span></div>
                  <div className="flex justify-between font-bold"><span>Total</span><span>${selectedOrder.total.toFixed(2)}</span></div>
                </div>
              </div>

              {selectedOrder.proofOfPayment && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Proof of Payment</p>
                  <img src={selectedOrder.proofOfPayment} alt="Proof" className="max-h-64 rounded-lg border" />
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-2">
                <p className="w-full text-sm text-muted-foreground mb-1">Update Status:</p>
                {["awaiting_payment", "paid", "processing", "shipped", "delivered", "cancelled"].map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(selectedOrder.id, s)}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                      selectedOrder.status === s
                        ? "bg-primary text-white"
                        : "bg-slate-100 hover:bg-slate-200"
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

      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{order.customerName}</p>
                    <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
                  </div>
                </TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>${order.total.toFixed(2)}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1 text-xs capitalize">
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
                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium hover:bg-slate-100 transition-colors"
                  >
                    <Eye className="h-3 w-3" /> View
                  </button>
                </TableCell>
              </TableRow>
            ))}
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No orders yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
