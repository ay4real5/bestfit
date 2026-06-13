"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
import { ArrowLeft, Package } from "lucide-react";

interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
}

interface MockOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered";
  createdAt: string;
  items: OrderItem[];
}

const mockOrders: MockOrder[] = [
  {
    id: "ORD-001",
    customerName: "Mike Johnson",
    customerEmail: "mike@example.com",
    total: 84.98,
    status: "delivered",
    createdAt: "2024-03-15",
    items: [
      { productName: "Whey Protein Isolate", quantity: 1, price: 49.99 },
      { productName: "BCAA Recovery", quantity: 1, price: 22.99 },
    ],
  },
  {
    id: "ORD-002",
    customerName: "Sarah Williams",
    customerEmail: "sarah@example.com",
    total: 34.99,
    status: "shipped",
    createdAt: "2024-03-18",
    items: [{ productName: "Pre-Workout Explosion", quantity: 1, price: 34.99 }],
  },
  {
    id: "ORD-003",
    customerName: "David Chen",
    customerEmail: "david@example.com",
    total: 74.98,
    status: "processing",
    createdAt: "2024-03-20",
    items: [
      { productName: "Creatine Monohydrate", quantity: 1, price: 19.99 },
      { productName: "Mass Gainer Elite", quantity: 1, price: 54.99 },
    ],
  },
  {
    id: "ORD-004",
    customerName: "Emma Thompson",
    customerEmail: "emma@example.com",
    total: 29.99,
    status: "pending",
    createdAt: "2024-03-22",
    items: [{ productName: "Fat Burner Pro", quantity: 1, price: 29.99 }],
  },
];

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    processing: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    shipped: "bg-purple-100 text-purple-800 hover:bg-purple-100",
    delivered: "bg-green-100 text-green-800 hover:bg-green-100",
  };
  return <Badge className={variants[status] || ""}>{status}</Badge>;
}

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders] = useState<MockOrder[]>(mockOrders);

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("festfit_admin")) {
      router.push("/admin/login");
    }
  }, [router]);

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

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
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

      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Items</TableHead>
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
                <TableCell>{order.createdAt}</TableCell>
                <TableCell>${order.total.toFixed(2)}</TableCell>
                <TableCell>
                  <StatusBadge status={order.status} />
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {order.items.map((item, i) => (
                      <p key={i} className="text-xs text-muted-foreground">
                        {item.quantity}x {item.productName} (${item.price.toFixed(2)})
                      </p>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
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
