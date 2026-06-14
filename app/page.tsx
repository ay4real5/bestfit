"use client";

import Link from "next/link";
import Image from "next/image";
import { getFeaturedProducts, getProducts, categories } from "@/lib/data";
import { useCart } from "@/components/CartProvider";
import { useWishlist } from "@/components/WishlistProvider";
import { ArrowRight, Star, Truck, ShieldCheck, Clock, ShoppingCart, Heart } from "lucide-react";
import { formatPrice } from "@/lib/currency";
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
      <section className="relative overflow-hidden bg-stone-950 py-20 md:py-36">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1600&h=900&fit=crop"
            alt="Gym background"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/60 via-stone-950/80 to-stone-950" />
        </div>
        <div className="container relative mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-6 inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium tracking-wide text-primary uppercase">
              Nigeria&apos;s Premium Supplement Store
            </span>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-7xl leading-[1.1]">
              Train Hard.{" "}
              <span className="text-primary">Recover</span>{" "}
              Smarter.
            </h1>
            <p className="mx-auto mb-10 max-w-xl text-base leading-relaxed text-stone-400 md:text-lg">
              Fest Fit delivers authentic, premium-quality supplements — protein, creatine, pre-workout and more — straight to your door across Nigeria.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row justify-center">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-primary/40"
              >
                Shop Now <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#featured"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-700 bg-stone-900/50 px-8 py-3.5 text-sm font-semibold text-stone-300 backdrop-blur-sm transition-all hover:border-stone-600 hover:bg-stone-800 hover:text-white"
              >
                View Best Sellers
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-stone-200 bg-white py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Truck, title: "Free Delivery", desc: "On orders over ₦50,000" },
              { icon: ShieldCheck, title: "100% Authentic", desc: "Genuine products only" },
              { icon: Star, title: "Top Rated", desc: "Loved by Nigerian athletes" },
              { icon: Clock, title: "Fast Delivery", desc: "Lagos same-day available" },
            ].map((f) => (
              <div
                key={f.title}
                className="group flex items-center gap-4 rounded-2xl border border-stone-100 bg-stone-50/50 p-5 transition-all hover:border-primary/20 hover:bg-white hover:shadow-lg hover:shadow-stone-200/50"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <f.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-stone-800">{f.title}</p>
                  <p className="text-sm text-stone-500">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-stone-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-primary">Browse</span>
            <h2 className="text-3xl font-bold tracking-tight text-stone-900 md:text-4xl">Shop by Category</h2>
            <p className="mt-3 text-stone-500">Find the perfect supplement for your goals</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.slice(0, 4).map((cat) => (
              <Link key={cat} href={`/products?category=${encodeURIComponent(cat)}`}>
                <div className="group flex items-center justify-between rounded-2xl border border-stone-200 bg-white p-6 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-stone-200/40">
                  <div>
                    <h3 className="text-lg font-semibold text-stone-800 group-hover:text-primary transition-colors">
                      {cat}
                    </h3>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-stone-400 transition-all group-hover:bg-primary group-hover:text-white">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="featured" className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-primary">Featured</span>
              <h2 className="text-3xl font-bold tracking-tight text-stone-900 md:text-4xl">Featured Products</h2>
              <p className="mt-3 text-stone-500">Our most popular supplements</p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              View All <ArrowRight className="h-4 w-4" />
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
      <section className="py-20 bg-stone-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12">
            <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-primary">New</span>
            <h2 className="text-3xl font-bold tracking-tight text-stone-900 md:text-4xl">New Arrivals</h2>
            <p className="mt-3 text-stone-500">The latest additions to our supplement range</p>
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
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-stone-100 bg-white transition-all hover:border-stone-200 hover:shadow-xl hover:shadow-stone-200/40">
      <div className="relative">
        <Link href={`/products/${product.slug}`} className="block">
          <div className="relative aspect-square overflow-hidden bg-stone-100">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain transition-transform duration-500 group-hover:scale-105"
            />
            {product.compareAtPrice && (
              <span className="absolute left-3 top-3 rounded-full bg-red-500 px-2.5 py-1 text-xs font-semibold text-white">
                Sale
              </span>
            )}
            <button
              onClick={handleWishlist}
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm transition-all hover:bg-white hover:scale-105 pointer-events-auto"
            >
              <Heart
                className={`h-4 w-4 transition-colors ${inWishlist ? "fill-red-500 text-red-500" : "text-stone-500 hover:text-red-500"}`}
              />
            </button>
          </div>
        </Link>
        {product.inStock && (
          <div className="absolute inset-x-0 bottom-0 flex justify-center pb-5 opacity-0 transition-all duration-300 group-hover:opacity-100 pointer-events-none">
            <button
              type="button"
              className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-stone-900 px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-transform hover:scale-105 hover:bg-stone-800"
              onClick={handleQuickAdd}
            >
              <ShoppingCart className="h-4 w-4" /> Quick Add
            </button>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <Link href={`/products/${product.slug}`}>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-stone-400">
            {product.category}
          </p>
          <h3 className="mt-1.5 text-[15px] font-semibold leading-snug text-stone-800 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="mt-auto flex items-center justify-between pt-4">
          <div className="flex items-center gap-2.5">
            <span className="text-lg font-bold text-stone-900">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-sm text-stone-400 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
          <button
            onClick={handleQuickAdd}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-stone-600 transition-all hover:bg-primary hover:text-white"
            type="button"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

