"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { getProductBySlug, getProducts, getReviewsByProduct } from "@/lib/data";
import { useCart } from "@/components/CartProvider";
import { useWishlist } from "@/components/WishlistProvider";
import StarRating from "@/components/StarRating";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
} from "lucide-react";
import { toast } from "sonner";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const product = getProductBySlug(slug);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const inWishlist = product ? isInWishlist(product.id) : false;
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center md:px-6">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <p className="mt-2 text-muted-foreground">
          The supplement you are looking for does not exist.
        </p>
        <Link href="/products">
          <Button className="mt-6">Browse Products</Button>
        </Link>
      </div>
    );
  }

  const related = getProducts()
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

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
    <div className="container mx-auto px-4 py-8 md:px-6">
      <Link
        href="/products"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to shop
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-2xl border bg-slate-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
          {product.compareAtPrice && (
            <Badge className="absolute left-4 top-4 bg-destructive text-white text-base px-3 py-1">
              Sale
            </Badge>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <div className="mb-4">
            <Badge variant="secondary" className="mb-2">
              {product.category}
            </Badge>
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                {product.name}
              </h1>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0"
                onClick={() => {
                  toggleWishlist(product);
                  toast(inWishlist ? "Removed from wishlist" : "Added to wishlist");
                }}
              >
                <Heart
                  className={`h-5 w-5 ${inWishlist ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}
                />
              </Button>
            </div>
          </div>

          <div className="mb-6 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary">
              ${product.price.toFixed(2)}
            </span>
            {product.compareAtPrice && (
              <span className="text-xl text-muted-foreground line-through">
                ${product.compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>

          <div className="mb-6 grid grid-cols-2 gap-3 text-sm">
            {product.weight && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Award className="h-4 w-4 text-primary" />
                Weight: {product.weight}
              </div>
            )}
            {product.servings && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Check className="h-4 w-4 text-primary" />
                {product.servings} servings
              </div>
            )}
            <div className="flex items-center gap-2 text-muted-foreground">
              <Truck className="h-4 w-4 text-primary" />
              Free shipping over $50
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <RotateCcw className="h-4 w-4 text-primary" />
              30-day returns
            </div>
          </div>

          <Separator className="mb-6" />

          {product.inStock ? (
            <>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium">
                  Quantity
                </label>
                <div className="flex w-fit items-center gap-3 rounded-lg border">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-l-lg hover:bg-muted transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-r-lg hover:bg-muted transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <button
                type="button"
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-base font-medium text-white hover:bg-primary/90 transition-colors"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart — ${(product.price * quantity).toFixed(2)}
              </button>
            </>
          ) : (
            <Button size="lg" variant="secondary" disabled className="w-full">
              Out of Stock
            </Button>
          )}
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-bold">You May Also Like</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <Link key={p.id} href={`/products/${p.slug}`}>
                <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
                  <div className="relative aspect-video overflow-hidden bg-slate-100">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-4">
                    <p className="text-xs font-medium text-muted-foreground uppercase">
                      {p.category}
                    </p>
                    <h3 className="mt-1 font-semibold group-hover:text-primary transition-colors">
                      {p.name}
                    </h3>
                    <p className="mt-1 text-lg font-bold">
                      ${p.price.toFixed(2)}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Product Tabs */}
      <section className="mt-16">
        <Tabs defaultValue="description">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value="description"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Description
            </TabsTrigger>
            <TabsTrigger
              value="nutrition"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Nutrition Facts
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Reviews ({reviews.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="pt-6">
            <div className="max-w-2xl">
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
              <div className="mt-6 space-y-2">
                <h4 className="font-semibold">Highlights</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Premium quality ingredients sourced from certified facilities</li>
                  <li>Third-party lab tested for purity and potency</li>
                  <li>Fast-absorbing formula for optimal results</li>
                  <li>No artificial fillers or banned substances</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="nutrition" className="pt-6">
            <div className="max-w-xl">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold border-b pb-2 mb-4">Supplement Facts</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium">Serving Size</span>
                      <span>{product.weight ? "1 scoop" : "1 capsule"}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium">Servings Per Container</span>
                      <span>{product.servings || "N/A"}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2 pt-2">
                      <span className="font-semibold">Amount Per Serving</span>
                      <span>% Daily Value</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Protein</span>
                      <span>25g</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Carbohydrates</span>
                      <span>3g</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Fat</span>
                      <span>1g</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Sugar</span>
                      <span>1g</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Sodium</span>
                      <span>150mg</span>
                    </div>
                  </div>
                  <p className="mt-4 text-xs text-muted-foreground">
                    * Percent Daily Values are based on a 2,000 calorie diet.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="pt-6">
            {reviews.length > 0 && (
              <div className="mb-6 flex items-center gap-2">
                <StarRating rating={avgRating} size={20} />
                <span className="text-muted-foreground">
                  {avgRating.toFixed(1)} out of 5 ({reviews.length} reviews)
                </span>
              </div>
            )}
            {reviews.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">
                    No reviews yet. Be the first to review this product!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                            {review.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{review.name}</p>
                            <p className="text-xs text-muted-foreground">{review.date}</p>
                          </div>
                        </div>
                        <StarRating rating={review.rating} size={14} />
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                        {review.comment}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
