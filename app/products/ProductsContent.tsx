"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { getProducts, categories } from "@/lib/data";
import { useCart } from "@/components/CartProvider";
import { useWishlist } from "@/components/WishlistProvider";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal, ShoppingCart, Heart } from "lucide-react";
import { formatPrice } from "@/lib/currency";
import { toast } from "sonner";

export default function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState("featured");

  const allProducts = getProducts();

  const filtered = useMemo(() => {
    let result = [...allProducts];

    if (category) {
      result = result.filter((p) => p.category === category);
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        break;
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [allProducts, category, search, sort]);

  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <div className="mb-10">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">Shop</span>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 md:text-4xl">All Products</h1>
        <p className="mt-3 text-stone-500">
          {filtered.length} supplement{filtered.length !== 1 ? "s" : ""} available
        </p>
      </div>

      {/* Filters */}
      <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <Input
            placeholder="Search supplements..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-full border-stone-200 pl-9 text-sm"
          />
        </div>
        <div className="flex gap-3">
          <Select value={category} onValueChange={(v) => setCategory(v ?? "")}>
            <SelectTrigger className="w-[160px] rounded-full border-stone-200">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={(v) => setSort(v ?? "featured")}>
            <SelectTrigger className="w-[160px] rounded-full border-stone-200">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>
          {category && (
            <button
              type="button"
              className="inline-flex items-center rounded-full border border-stone-200 px-4 py-2 text-sm font-medium text-stone-500 transition-colors hover:bg-stone-50"
              onClick={() => setCategory("")}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-stone-100 mb-6">
            <Search className="h-10 w-10 text-stone-300" />
          </div>
          <h3 className="text-lg font-semibold text-stone-900">No products found</h3>
          <p className="mt-2 text-stone-500">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProductCard({ product }: { product: ReturnType<typeof getProducts>[0] }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const handleQuickAdd = () => {
    if (!product.inStock) return;
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
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {product.compareAtPrice && (
              <span className="absolute left-3 top-3 rounded-full bg-red-500 px-2.5 py-1 text-xs font-semibold text-white">
                Sale
              </span>
            )}
            {!product.inStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-stone-950/50 backdrop-blur-[2px]">
                <span className="rounded-full bg-white/90 px-4 py-1.5 text-sm font-semibold text-stone-900">
                  Out of Stock
                </span>
              </div>
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
          {product.inStock && (
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-stone-600 transition-all hover:bg-primary hover:text-white"
              onClick={handleQuickAdd}
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
