"use client";

import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "@/components/WishlistProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Heart, ShoppingCart, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function WishlistPage() {
  const { items, removeFromWishlist } = useWishlist();

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <Link
        href="/products"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to shop
      </Link>

      <h1 className="mb-8 text-3xl font-bold tracking-tight">Your Wishlist</h1>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Heart className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
          <h2 className="text-2xl font-bold">Your wishlist is empty</h2>
          <p className="mt-2 text-muted-foreground">
            Save items you love for later.
          </p>
          <Link href="/products">
            <Button className="mt-6">Browse Products</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((product) => (
            <Card key={product.id} className="group overflow-hidden">
              <Link href={`/products/${product.slug}`}>
                <div className="relative aspect-square overflow-hidden bg-slate-100">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              </Link>
              <CardContent className="p-4">
                <p className="text-xs font-medium text-muted-foreground uppercase">
                  {product.category}
                </p>
                <h3 className="mt-1 font-semibold">{product.name}</h3>
                <p className="mt-1 text-lg font-bold">${product.price.toFixed(2)}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    removeFromWishlist(product.id);
                    toast.info("Removed from wishlist");
                  }}
                >
                  <Heart className="mr-1 h-3.5 w-3.5 fill-current" /> Remove
                </Button>
                <Link href={`/products/${product.slug}`} className="flex-1">
                  <Button size="sm" className="w-full">
                    <ShoppingCart className="mr-1 h-3.5 w-3.5" /> View
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
