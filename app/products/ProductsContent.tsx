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
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal, ShoppingCart, Heart } from "lucide-react";
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
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
        <p className="mt-1 text-muted-foreground">
          {filtered.length} supplement{filtered.length !== 1 ? "s" : ""} available
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search supplements..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-3">
          <Select value={category} onValueChange={(v) => setCategory(v ?? "")}>
            <SelectTrigger className="w-[160px]">
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
            <SelectTrigger className="w-[160px]">
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
              className="inline-flex items-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-slate-100 transition-colors"
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
          <Search className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">No products found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters.</p>
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
            {!product.inStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <Badge variant="secondary" className="text-base">
                  Out of Stock
                </Badge>
              </div>
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
        {product.inStock && (
          <div className="absolute inset-x-0 bottom-0 flex justify-center pb-4 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none">
            <button
              type="button"
              className="pointer-events-auto inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white shadow-lg hover:bg-primary/90"
              onClick={handleQuickAdd}
            >
              <ShoppingCart className="h-3.5 w-3.5" /> Quick Add
            </button>
          </div>
        )}
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
          <span className="text-lg font-bold">
            ${product.price.toFixed(2)}
          </span>
          {product.compareAtPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.compareAtPrice.toFixed(2)}
            </span>
          )}
        </div>
        {product.inStock && (
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-slate-100 transition-colors"
            onClick={handleQuickAdd}
          >
            <ShoppingCart className="h-4 w-4 text-slate-600" />
          </button>
        )}
      </CardFooter>
    </Card>
  );
}
