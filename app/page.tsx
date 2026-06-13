"use client";

import Link from "next/link";
import Image from "next/image";
import { getFeaturedProducts, getProducts, categories } from "@/lib/data";
import { useCart } from "@/components/CartProvider";
import { useWishlist } from "@/components/WishlistProvider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, Truck, ShieldCheck, Clock, ShoppingCart, Heart } from "lucide-react";
import { toast } from "sonner";

export default function Home() {
  const featured = getFeaturedProducts();
  const allProducts = getProducts();
  const latest = [...allProducts].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  ).slice(0, 4);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-900 py-20 md:py-32">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://picsum.photos/seed/festfithero/1600/900"
            alt="Gym background"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="container relative mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
              Premium Supplements
            </Badge>
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-white md:text-6xl">
              Fuel Your{" "}
              <span className="text-primary">Fitness</span> Journey
            </h1>
            <p className="mb-8 text-lg text-slate-300">
              High-quality protein, pre-workout, vitamins, and recovery
              supplements trusted by athletes worldwide.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row justify-center">
              <Link href="/products">
                <Button size="lg" className="gap-2">
                  Shop Now <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#featured">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  View Best Sellers
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b bg-white py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Truck,
                title: "Free Shipping",
                desc: "On orders over $50",
              },
              {
                icon: ShieldCheck,
                title: "Lab Tested",
                desc: "Quality guaranteed",
              },
              {
                icon: Star,
                title: "Top Rated",
                desc: "4.9/5 customer reviews",
              },
              {
                icon: Clock,
                title: "Fast Delivery",
                desc: "2-3 business days",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="flex items-center gap-4 rounded-xl border p-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight">Shop by Category</h2>
            <p className="mt-2 text-muted-foreground">
              Find the perfect supplement for your goals
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.slice(0, 4).map((cat) => (
              <Link
                key={cat}
                href={`/products?category=${encodeURIComponent(cat)}`}
              >
                <Card className="group cursor-pointer transition-shadow hover:shadow-md">
                  <CardContent className="flex items-center justify-between p-6">
                    <div>
                      <h3 className="font-semibold group-hover:text-primary transition-colors">
                        {cat}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {allProducts.filter((p) => p.category === cat).length}{" "}
                        products
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="featured" className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Featured Products</h2>
              <p className="mt-2 text-muted-foreground">
                Our most popular supplements
              </p>
            </div>
            <Link href="/products">
              <Button variant="ghost" className="gap-2">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-10">
            <h2 className="text-3xl font-bold tracking-tight">New Arrivals</h2>
            <p className="mt-2 text-muted-foreground">
              Latest additions to our catalog
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {latest.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function ProductCard({ product }: { product: ReturnType<typeof getProducts>[0] }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const handleQuickAdd = () => {
    console.log("Adding to cart:", product.name);
    addToCart(product, 1);
    toast.success(`${product.name} added to cart`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    toast(inWishlist ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <Card className="group h-full overflow-hidden transition-shadow hover:shadow-lg">
      <div className="relative">
        <Link href={`/products/${product.slug}`} className="block">
          <div className="relative aspect-square overflow-hidden bg-slate-100">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            {product.compareAtPrice && (
              <Badge className="absolute left-2 top-2 bg-destructive text-white">
                Sale
              </Badge>
            )}
            <button
              onClick={handleWishlist}
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm transition-colors hover:bg-white pointer-events-auto"
            >
              <Heart
                className={`h-4 w-4 ${inWishlist ? "fill-red-500 text-red-500" : "text-slate-600"}`}
              />
            </button>
          </div>
        </Link>
        {/* Quick Add overlay on hover */}
        <div className="absolute inset-x-0 bottom-0 flex justify-center pb-4 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none">
          <button
            type="button"
            className="pointer-events-auto inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white shadow-lg hover:bg-primary/90"
            onClick={handleQuickAdd}
          >
            <ShoppingCart className="h-3.5 w-3.5" /> Quick Add
          </button>
        </div>
      </div>
      <CardContent className="p-4">
        <Link href={`/products/${product.slug}`}>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {product.category}
          </p>
          <h3 className="mt-1 font-semibold leading-tight group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
          {product.compareAtPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.compareAtPrice.toFixed(2)}
            </span>
          )}
        </div>
        <button
          onClick={handleQuickAdd}
          className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-slate-100 transition-colors"
          type="button"
        >
          <ShoppingCart className="h-4 w-4 text-slate-600" />
        </button>
      </CardFooter>
    </Card>
  );
}

