"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, LogIn, UserPlus } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const { login, register, isLoggedIn } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    city: "",
    phone: "",
  });

  if (isLoggedIn) {
    router.push("/account");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (mode === "login") {
      const success = login(form.email, form.password);
      if (success) {
        toast.success("Welcome back!");
        router.push("/account");
      } else {
        toast.error("Invalid email or password");
      }
    } else {
      if (form.password !== form.confirmPassword) {
        toast.error("Passwords do not match");
        setLoading(false);
        return;
      }
      const success = register(form.name, form.email, form.password, form.address, form.city, form.phone);
      if (success) {
        toast.success("Account created!");
        router.push("/account");
      } else {
        toast.error("Email already registered");
      }
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto flex min-h-[80vh] items-center justify-center px-4 md:px-6">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to store
        </Link>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
              {mode === "login" ? <LogIn className="h-6 w-6" /> : <UserPlus className="h-6 w-6" />}
            </div>
            <CardTitle>{mode === "login" ? "Sign In" : "Create Account"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                    />
                  </div>
                </>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
              {mode === "register" && (
                <div className="space-y-2">
                  <Label htmlFor="confirm">Confirm Password</Label>
                  <Input
                    id="confirm"
                    type="password"
                    required
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  />
                </div>
              )}
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
              </button>
            </form>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              {mode === "login" ? (
                <>
                  New customer?{" "}
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    onClick={() => setMode("register")}
                  >
                    Create an account
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    onClick={() => setMode("login")}
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
