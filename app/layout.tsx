import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/components/AuthProvider";
import { CartProvider } from "@/components/CartProvider";
import { WishlistProvider } from "@/components/WishlistProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fest Fit Supplements | Premium Fitness Supplements",
  description: "Shop premium protein, pre-workout, vitamins, and more. Fuel your fitness journey with Fest Fit Supplements.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Header />
              <Breadcrumb />
              <main className="flex-1">{children}</main>
              <Footer />
              <Toaster position="top-right" />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
