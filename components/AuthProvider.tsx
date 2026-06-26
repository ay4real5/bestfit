"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

interface Customer {
  id: string;
  name: string;
  email: string;
  address: string;
  city: string;
  phone: string;
}

interface OrderRecord {
  id: string;
  items: { name: string; quantity: number; price: number }[];
  subtotal: number;
  deliveryCost: number;
  discount?: number;
  promoCode?: string;
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

interface AuthContextType {
  customer: Customer | null;
  orders: OrderRecord[];
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string, address: string, city: string, phone: string) => boolean;
  logout: () => void;
  addOrder: (order: OrderRecord) => void;
  isLoggedIn: boolean;
  // Admin order management
  allOrders: OrderRecord[];
  updateOrderStatus: (orderId: string, status: string) => void;
  getOrders: () => OrderRecord[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ALL_ORDERS_KEY = "festfit_all_orders";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [allOrders, setAllOrders] = useState<OrderRecord[]>([]);

  useEffect(() => {
    const savedCustomer = localStorage.getItem("festfit_customer");
    const savedOrders = localStorage.getItem("festfit_customer_orders");
    const savedAllOrders = localStorage.getItem(ALL_ORDERS_KEY);
    if (savedCustomer) {
      try {
        setCustomer(JSON.parse(savedCustomer));
      } catch {}
    }
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch {}
    }
    if (savedAllOrders) {
      try {
        setAllOrders(JSON.parse(savedAllOrders));
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (customer) {
      localStorage.setItem("festfit_customer", JSON.stringify(customer));
    } else {
      localStorage.removeItem("festfit_customer");
    }
  }, [customer]);

  useEffect(() => {
    localStorage.setItem("festfit_customer_orders", JSON.stringify(orders));
  }, [orders]);

  const login = useCallback((email: string, password: string): boolean => {
    const customers = JSON.parse(localStorage.getItem("festfit_customers") || "[]");
    const found = customers.find((c: Customer & { password: string }) => c.email === email && c.password === password);
    if (found) {
      const { password: _, ...customerData } = found;
      setCustomer(customerData);
      return true;
    }
    return false;
  }, []);

  const register = useCallback((name: string, email: string, password: string, address: string, city: string, phone: string): boolean => {
    const customers = JSON.parse(localStorage.getItem("festfit_customers") || "[]");
    if (customers.find((c: Customer) => c.email === email)) {
      return false;
    }
    const newCustomer = { id: `cust_${Date.now()}`, name, email, address, city, phone };
    customers.push({ ...newCustomer, password });
    localStorage.setItem("festfit_customers", JSON.stringify(customers));
    setCustomer(newCustomer);
    return true;
  }, []);

  const logout = useCallback(() => {
    setCustomer(null);
    localStorage.removeItem("festfit_customer");
  }, []);

  const addOrder = useCallback((order: OrderRecord) => {
    setOrders((prev) => [order, ...prev]);
    setAllOrders((prev) => {
      const updated = [order, ...prev];
      localStorage.setItem(ALL_ORDERS_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: string) => {
    setAllOrders((prev) => {
      const updated = prev.map((o) => o.id === orderId ? { ...o, status } : o);
      localStorage.setItem(ALL_ORDERS_KEY, JSON.stringify(updated));
      return updated;
    });
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o));
  }, []);

  const getOrders = useCallback((): OrderRecord[] => {
    const saved = localStorage.getItem(ALL_ORDERS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return allOrders;
  }, [allOrders]);

  return (
    <AuthContext.Provider
      value={{
        customer,
        orders,
        login,
        register,
        logout,
        addOrder,
        isLoggedIn: !!customer,
        allOrders,
        updateOrderStatus,
        getOrders,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
