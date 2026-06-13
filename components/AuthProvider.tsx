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
  total: number;
  status: string;
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<OrderRecord[]>([]);

  useEffect(() => {
    const savedCustomer = localStorage.getItem("festfit_customer");
    const savedOrders = localStorage.getItem("festfit_customer_orders");
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
  }, []);

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
