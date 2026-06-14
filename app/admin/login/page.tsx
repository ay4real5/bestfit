"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Shield } from "lucide-react";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (email === "admin@festfit.com" && password === "admin123") {
        localStorage.setItem("festfit_admin", "true");
        toast.success("Welcome back, admin!");
        router.push("/admin/dashboard");
      } else {
        toast.error("Invalid credentials. Try admin@festfit.com / admin123");
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="container mx-auto flex min-h-[80vh] items-center justify-center px-4 md:px-6">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to store
        </Link>

        <div className="rounded-2xl border border-stone-100 bg-white p-8 shadow-sm">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
              <Shield className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-stone-900">Admin Login</h2>
            <p className="mt-2 text-sm text-stone-500">Sign in to manage your supplement catalog</p>
          </div>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-stone-700">Email</Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="admin@festfit.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl border-stone-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-stone-700">Password</Label>
              <Input
                id="password"
                type="password"
                required
                placeholder="admin123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl border-stone-200"
              />
            </div>
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-primary/40 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <p className="mt-6 text-center text-xs text-stone-400">
            Demo credentials: admin@festfit.com / admin123
          </p>
        </div>
      </div>
    </div>
  );
}
