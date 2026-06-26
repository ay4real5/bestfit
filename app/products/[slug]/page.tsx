"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { getReviewsByProduct } from "@/lib/data";
import { Product } from "@/lib/types";
import { useCart } from "@/components/CartProvider";
import { useWishlist } from "@/components/WishlistProvider";
import StarRating from "@/components/StarRating";
import {
  Minus,
  Plus,
  ShoppingCart,
  Check,
  Truck,
  RotateCcw,
  Award,
  ArrowLeft,
  Heart,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/currency";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products?slug=${encodeURIComponent(slug)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data: Product) => {
        setProduct(data);
        // Fetch related products
        return fetch(`/api/products?category=${encodeURIComponent(data.category)}`);
      })
      .then((res) => res.json())
      .then((data: Product[]) => {
        setRelated(data.filter((p) => p.slug !== slug).slice(0, 3));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  const inWishlist = product ? isInWishlist(product.id) : false;

  if (loading) {
    return (
      <div className="container mx-auto flex items-center justify-center px-4 py-32 md:px-6">
        <p className="text-stone-400">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-32 text-center md:px-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-stone-100 mb-8">
          <ShoppingCart className="h-10 w-10 text-stone-300" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">Product not found</h1>
        <p className="mt-3 text-stone-500">The supplement you are looking for does not exist.</p>
        <Link
          href="/products"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90"
        >
          Browse Products <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const reviews = getReviewsByProduct(product.id);
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 md:px-6">
      <Link
        href="/products"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to shop
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-stone-100 bg-white">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-4"
            priority
          />
          {product.compareAtPrice && (
            <span className="absolute left-4 top-4 rounded-full bg-red-500 px-3 py-1 text-sm font-semibold text-white">
              Sale
            </span>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <div className="mb-4">
            <span className="mb-3 inline-block text-[11px] font-semibold uppercase tracking-widest text-primary">{product.category}</span>
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl font-bold tracking-tight text-stone-900 md:text-4xl">
                {product.name}
              </h1>
              <button
                type="button"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-stone-400 transition-all hover:bg-stone-100 hover:text-red-500"
                onClick={() => {
                  toggleWishlist(product);
                  toast(inWishlist ? "Removed from wishlist" : "Added to wishlist");
                }}
              >
                <Heart
                  className={`h-5 w-5 transition-colors ${inWishlist ? "fill-red-500 text-red-500" : ""}`}
                />
              </button>
            </div>
          </div>

          <div className="mb-5 flex items-baseline gap-3">
            <span className="text-2xl font-bold text-stone-900 md:text-3xl">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-xl text-stone-400 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          <div className="mb-6 grid grid-cols-2 gap-3 text-sm">
            {product.weight && (
              <div className="flex items-center gap-2 text-stone-500">
                <Award className="h-4 w-4 text-primary" />
                Weight: {product.weight}
              </div>
            )}
            {product.servings && (
              <div className="flex items-center gap-2 text-stone-500">
                <Check className="h-4 w-4 text-primary" />
                {product.servings} servings
              </div>
            )}
            <div className="flex items-center gap-2 text-stone-500">
              <Truck className="h-4 w-4 text-primary" />
              Free delivery over ₦100,000; otherwise calculated by location
            </div>
            <div className="flex items-center gap-2 text-stone-500">
              <RotateCcw className="h-4 w-4 text-primary" />
              30-day returns
            </div>
          </div>

          <div className="my-6 h-px bg-stone-100" />

          {product.inStock ? (
            <>
              <div className="mb-5">
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  Quantity
                </label>
                <div className="flex w-fit items-center rounded-xl border border-stone-200 bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-l-xl text-stone-500 transition-colors hover:bg-stone-50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-semibold text-stone-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-r-xl text-stone-500 transition-colors hover:bg-stone-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <button
                type="button"
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-base font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-primary/40"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart — {formatPrice(product.price * quantity)}
              </button>
            </>
          ) : (
            <button
              type="button"
              disabled
              className="w-full inline-flex items-center justify-center rounded-full bg-stone-200 px-6 py-4 text-base font-semibold text-stone-500"
            >
              Out of Stock
            </button>
          )}
        </div>
      </div>

      {/* Mobile sticky add-to-cart */}
      {product.inStock && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-stone-200 bg-white/95 backdrop-blur-sm px-4 py-3 lg:hidden">
          <button
            type="button"
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart — {formatPrice(product.price * quantity)}
          </button>
        </div>
      )}

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-8 text-2xl font-bold tracking-tight text-stone-900">You May Also Like</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <Link key={p.id} href={`/products/${p.slug}`}>
                <div className="group overflow-hidden rounded-2xl border border-stone-100 bg-white transition-all hover:border-stone-200 hover:shadow-xl hover:shadow-stone-200/40">
                  <div className="relative aspect-video overflow-hidden bg-stone-100">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-stone-400">{p.category}</p>
                    <h3 className="mt-1.5 text-[15px] font-semibold text-stone-800 group-hover:text-primary transition-colors">
                      {p.name}
                    </h3>
                    <p className="mt-1 text-lg font-bold text-stone-900">{formatPrice(p.price)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Product Tabs */}
      <section className="mt-12 mb-20 lg:mb-0">
        <div className="border-b border-stone-200 overflow-x-auto">
          <nav className="flex gap-6 min-w-max">
            {["Description", "Nutrition Facts", `Reviews (${reviews.length})`].map((tab, i) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(i)}
                className={`border-b-2 pb-3 text-sm font-medium transition-colors ${
                  activeTab === i ? "border-primary text-stone-900" : "border-transparent text-stone-500 hover:text-stone-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="pt-8">
          {activeTab === 0 && (
            <div className="max-w-2xl">
              <p className="leading-relaxed text-stone-600">{product.description}</p>
              <div className="mt-8 space-y-3">
                <h4 className="text-lg font-semibold text-stone-900">Highlights</h4>
                <ul className="list-disc list-inside text-[15px] text-stone-500 space-y-2">
                  <li>Premium quality ingredients sourced from certified facilities</li>
                  <li>Third-party lab tested for purity and potency</li>
                  <li>Fast-absorbing formula for optimal results</li>
                  <li>No artificial fillers or banned substances</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 1 && (
            <div className="max-w-md">
              <h4 className="text-lg font-semibold text-stone-900 mb-4">Nutrition Facts</h4>
              <div className="rounded-2xl border border-stone-200 overflow-hidden">
                <div className="bg-stone-900 px-5 py-3">
                  <p className="text-white font-bold text-lg">Serving Size</p>
                  <p className="text-stone-300 text-sm">{product.weight ? `1 serving of ${product.weight}` : "1 serving"}</p>
                </div>
                {[
                  { label: "Servings per container", value: product.servings ? `${product.servings}` : "–" },
                  { label: "Calories", value: "–" },
                  { label: "Protein", value: product.category === "Protein" ? "25g" : "–" },
                  { label: "Carbohydrates", value: "–" },
                  { label: "Fat", value: "–" },
                ].map((row, i) => (
                  <div key={row.label} className={`flex justify-between px-5 py-3 text-sm ${i % 2 === 0 ? "bg-white" : "bg-stone-50"}`}>
                    <span className="text-stone-600">{row.label}</span>
                    <span className="font-semibold text-stone-900">{row.value}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-stone-400">* Full nutritional details are printed on the product packaging.</p>
            </div>
          )}

          {activeTab === 2 && (
            <div className="max-w-2xl space-y-6">
              {reviews.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-stone-400">No reviews yet. Be the first to review this product!</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-5xl font-bold text-stone-900">{avgRating.toFixed(1)}</span>
                    <div>
                      <StarRating rating={Math.round(avgRating)} />
                      <p className="mt-1 text-sm text-stone-500">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</p>
                    </div>
                  </div>
                  {reviews.map((review) => (
                    <div key={review.id} className="rounded-2xl border border-stone-100 bg-white p-5">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-stone-900">{review.name}</p>
                        <p className="text-xs text-stone-400">{new Date(review.date).toLocaleDateString()}</p>
                      </div>
                      <StarRating rating={review.rating} />
                      <p className="mt-3 text-[15px] leading-relaxed text-stone-600">{review.comment}</p>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
