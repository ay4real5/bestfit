"use client";

import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "@/components/WishlistProvider";
import { Heart, ShoppingCart, ArrowLeft, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/currency";
import { toast } from "sonner";

export default function WishlistPage() {
  const { items, removeFromWishlist } = useWishlist();

  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <Link
        href="/products"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to shop
      </Link>

      <div className="mb-10">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">Favorites</span>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 md:text-4xl">Your Wishlist</h1>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-stone-100 mb-8">
            <Heart className="h-10 w-10 text-stone-300" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-stone-900">Your wishlist is empty</h2>
          <p className="mt-3 max-w-md text-stone-500">Save items you love for later.</p>
          <Link
            href="/products"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90"
          >
            Browse Products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((product) => (
            <div key={product.id} className="group flex flex-col overflow-hidden rounded-2xl border border-stone-100 bg-white transition-all hover:border-stone-200 hover:shadow-xl hover:shadow-stone-200/40">
              <Link href={`/products/${product.slug}`}>
                <div className="relative aspect-square overflow-hidden bg-stone-100">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </Link>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-stone-400">{product.category}</p>
                <h3 className="mt-1.5 text-[15px] font-semibold text-stone-800">{product.name}</h3>
                <p className="mt-1 text-lg font-bold text-stone-900">{formatPrice(product.price)}</p>
                <div className="mt-auto flex gap-2 pt-4">
                  <button
                    type="button"
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-stone-200 px-4 py-2.5 text-sm font-medium text-stone-700 transition-all hover:bg-stone-50"
                    onClick={() => {
                      removeFromWishlist(product.id);
                      toast.info("Removed from wishlist");
                    }}
                  >
                    <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500" /> Remove
                  </button>
                  <Link
                    href={`/products/${product.slug}`}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-stone-900 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-stone-800"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" /> View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
