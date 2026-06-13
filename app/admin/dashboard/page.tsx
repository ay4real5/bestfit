"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getProducts } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Package, DollarSign, Tags, ArrowRight, LogOut, FolderOpen } from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const products = getProducts();

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("festfit_admin")) {
      router.push("/admin/login");
    }
  }, [router]);

  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + p.price * p.inventory, 0);
  const categoriesCount = new Set(products.map((p) => p.category)).size;
  const outOfStock = products.filter((p) => !p.inStock).length;

  const handleLogout = () => {
    localStorage.removeItem("festfit_admin");
    router.push("/admin/login");
  };

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your supplement store</p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-slate-100 transition-colors"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toFixed(0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Tags className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categoriesCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{outOfStock}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Manage Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Add, edit, or remove supplements from your catalog.
            </p>
            <Link href="/admin/products">
              <Button className="gap-2">
                Go to Products <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Manage product categories.
            </p>
            <Link href="/admin/categories">
              <Button variant="secondary" className="gap-2">
                <FolderOpen className="h-4 w-4" /> Manage
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              View and manage customer orders.
            </p>
            <Link href="/admin/orders">
              <Button variant="secondary" className="gap-2">
                View Orders <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Storefront</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Preview how customers see your store.
            </p>
            <Link href="/">
              <Button variant="outline" className="gap-2">
                View Store <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
