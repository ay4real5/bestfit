"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Product } from "@/lib/types";
import {
  Package,
  DollarSign,
  Tags,
  ArrowRight,
  LogOut,
  FolderOpen,
  ShoppingBag,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { formatPrice } from "@/lib/currency";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [ordersCount, setOrdersCount] = useState(0);
  const [ordersRevenue, setOrdersRevenue] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("festfit_admin")) {
      router.push("/admin/login");
    }

    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(console.error);

    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrdersCount(data.length);
        setOrdersRevenue(data.reduce((sum: number, o: { total: number }) => sum + (o.total || 0), 0));
      })
      .catch(console.error);
  }, [router]);

  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + p.price * p.inventory, 0);
  const categoriesCount = new Set(products.map((p) => p.category)).size;
  const outOfStock = products.filter((p) => !p.inStock).length;

  const handleLogout = () => {
    localStorage.removeItem("festfit_admin");
    router.push("/admin/login");
  };

  const stats = [
    {
      label: "Total Products",
      value: totalProducts,
      icon: Package,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Inventory Value",
      value: formatPrice(totalValue),
      icon: DollarSign,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Categories",
      value: categoriesCount,
      icon: Tags,
      color: "bg-violet-50 text-violet-600",
    },
    {
      label: "Orders",
      value: ordersCount,
      icon: ShoppingBag,
      color: "bg-amber-50 text-amber-600",
    },
  ];

  const quickLinks = [
    {
      title: "Products",
      desc: "Add, edit, or remove supplements from your catalog.",
      href: "/admin/products",
      icon: Package,
      color: "bg-stone-900 text-white hover:bg-stone-800",
    },
    {
      title: "Categories",
      desc: "Manage product categories.",
      href: "/admin/categories",
      icon: FolderOpen,
      color: "bg-white text-stone-900 border border-stone-200 hover:bg-stone-50",
    },
    {
      title: "Orders",
      desc: "View and manage customer orders with proof of payment.",
      href: "/admin/orders",
      icon: ShoppingBag,
      color: "bg-white text-stone-900 border border-stone-200 hover:bg-stone-50",
    },
    {
      title: "Storefront",
      desc: "Preview how customers see your store.",
      href: "/",
      icon: TrendingUp,
      color: "bg-white text-stone-900 border border-stone-200 hover:bg-stone-50",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-10 md:px-6">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Admin</span>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-stone-900 md:text-4xl">Dashboard</h1>
          <p className="mt-2 text-stone-500">Overview of your supplement store</p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-stone-200 px-5 py-2.5 text-sm font-medium text-stone-600 transition-all hover:bg-stone-50 hover:text-stone-900"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>

      {/* Stats */}
      <div className="mb-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-stone-100 bg-white p-6 transition-all hover:border-stone-200 hover:shadow-lg hover:shadow-stone-200/30"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-stone-500">{stat.label}</p>
                <p className="mt-2 text-3xl font-bold text-stone-900">{stat.value}</p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {outOfStock > 0 && (
        <div className="mb-10 flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>
            <span className="font-semibold">{outOfStock}</span> product{outOfStock > 1 ? "s are" : " is"} currently out of stock.{" "}
            <Link href="/admin/products" className="underline hover:no-underline">Manage inventory</Link>
          </span>
        </div>
      )}

      {ordersRevenue > 0 && (
        <div className="mb-10 rounded-2xl border border-stone-100 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-stone-500">Total Revenue</p>
              <p className="mt-1 text-3xl font-bold text-stone-900">{formatPrice(ordersRevenue)}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <h2 className="mb-5 text-lg font-semibold text-stone-900">Quick Actions</h2>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map((link) => (
          <Link
            key={link.title}
            href={link.href}
            className="group rounded-2xl border border-stone-100 bg-white p-6 transition-all hover:border-stone-200 hover:shadow-lg hover:shadow-stone-200/30"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-stone-100 text-stone-600 transition-colors group-hover:bg-primary group-hover:text-white">
              <link.icon className="h-5 w-5" />
            </div>
            <h3 className="text-[15px] font-semibold text-stone-900">{link.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-stone-500">{link.desc}</p>
            <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
              Go to {link.title} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
