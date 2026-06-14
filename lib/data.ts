import { Product, Review, PromoCode } from "./types";

export const categories = [
  "Protein",
  "Pre-Workout",
  "Vitamins",
  "Weight Loss",
  "Recovery",
  "Creatine",
  "Amino Acids",
];

export const initialProducts: Product[] = [
  {
    id: "1",
    name: "ON Gold Standard 100% Plant — French Vanilla Crème",
    slug: "on-plant-protein-vanilla",
    description:
      "Optimum Nutrition Gold Standard 100% Plant Protein in French Vanilla Crème. 24g high protein per serving from 100% plant sources. Complete amino acid profile to help build and maintain muscle. Vegan-friendly, 684g (21 servings).",
    price: 45000,
    compareAtPrice: 52000,
    image: "/products/on-plant-vanilla.jpg",
    category: "Protein",
    tags: ["vegan", "plant-based", "best-seller"],
    inStock: true,
    inventory: 30,
    featured: true,
    weight: "684g",
    servings: 21,
    createdAt: "2024-01-15",
    deliveryCost: 0,
  },
  {
    id: "2",
    name: "ON Gold Standard 100% Plant — Double Rich Chocolate",
    slug: "on-plant-protein-chocolate",
    description:
      "Optimum Nutrition Gold Standard 100% Plant Protein in Double Rich Chocolate. 24g high protein per serving from 100% plant sources. Complete amino acid profile. Vegan certified, 684g (20 servings).",
    price: 45000,
    compareAtPrice: 52000,
    image: "/products/on-plant-chocolate.jpg",
    category: "Protein",
    tags: ["vegan", "plant-based", "chocolate"],
    inStock: true,
    inventory: 25,
    featured: true,
    weight: "684g",
    servings: 20,
    createdAt: "2024-01-16",
    deliveryCost: 0,
  },
  {
    id: "3",
    name: "ON Micronised Creatine Powder — 634g",
    slug: "on-creatine-634g",
    description:
      "Optimum Nutrition Micronised Creatine Powder, 634g. 100% pure creatine monohydrate for performance support. 3g creatine per serving, unflavoured. 106 servings. Mixes easily into any shake or drink.",
    price: 28000,
    compareAtPrice: 34000,
    image: "/products/on-creatine-634g.jpg",
    category: "Creatine",
    tags: ["strength", "power", "performance"],
    inStock: true,
    inventory: 40,
    featured: true,
    weight: "634g",
    servings: 106,
    createdAt: "2024-02-01",
    deliveryCost: 0,
  },
  {
    id: "4",
    name: "ON Gold Standard Pre-Workout — Fruit Punch",
    slug: "on-preworkout-fruit-punch",
    description:
      "Optimum Nutrition Gold Standard Pre-Workout in Fruit Punch. 175mg natural caffeine, 3.4g beta-alanine, and 250mg L-theanine for energy, focus, power and performance. 330g, 30 servings.",
    price: 32000,
    compareAtPrice: 40000,
    image: "/products/on-preworkout.jpg",
    category: "Pre-Workout",
    tags: ["energy", "focus", "performance"],
    inStock: true,
    inventory: 20,
    featured: true,
    weight: "330g",
    servings: 30,
    createdAt: "2024-02-10",
    deliveryCost: 0,
  },
  {
    id: "5",
    name: "ON Micronised Creatine Powder — 317g",
    slug: "on-creatine-317g",
    description:
      "Optimum Nutrition Micronised Creatine Powder, 317g. 100% pure creatine monohydrate. 3g creatine per serving, unflavoured. 93 servings. Perfect starter size for those new to creatine supplementation.",
    price: 18000,
    compareAtPrice: 22000,
    image: "/products/on-creatine-317g.jpg",
    category: "Creatine",
    tags: ["strength", "power", "starter"],
    inStock: true,
    inventory: 50,
    featured: false,
    weight: "317g",
    servings: 93,
    createdAt: "2024-02-12",
    deliveryCost: 0,
  },
  {
    id: "6",
    name: "PhD Smart Protein Plant — Chocolate Cookie",
    slug: "phd-plant-chocolate-cookie",
    description:
      "PhD Smart Protein Plant in Chocolate Cookie flavour. 18g protein per serving, 0g sugar. Vegan Society approved. Made from plant-based sources. Perfect for mousse, recipes, and shakes. 500g, 20 servings.",
    price: 30000,
    compareAtPrice: 36000,
    image: "/products/phd-plant-choc-cookie.jpg",
    category: "Protein",
    tags: ["vegan", "plant-based", "zero-sugar"],
    inStock: true,
    inventory: 22,
    featured: true,
    weight: "500g",
    servings: 20,
    createdAt: "2024-03-01",
    deliveryCost: 0,
  },
  {
    id: "7",
    name: "Applied Nutrition Diet Protein — Chocolate Dessert",
    slug: "applied-diet-protein-chocolate",
    description:
      "Applied Nutrition Diet Protein in Chocolate Dessert flavour. High protein, low sugar lean shake. 20g protein, 101 calories, 1g carbs, and just 1g sugar per 25g serving. Amazing taste and easy mixing. 450g, 18 servings.",
    price: 24000,
    compareAtPrice: 30000,
    image: "/products/applied-diet-protein.jpg",
    category: "Weight Loss",
    tags: ["diet", "lean", "low-sugar", "weight-loss"],
    inStock: true,
    inventory: 35,
    featured: false,
    weight: "450g",
    servings: 18,
    createdAt: "2024-03-05",
    deliveryCost: 0,
  },
  {
    id: "8",
    name: "PhD Smart Protein Plant — Strawberry",
    slug: "phd-plant-strawberry",
    description:
      "PhD Smart Protein Plant in Strawberry flavour. 20g protein per serving, 0g sugar. 100% recyclable bag. Vegan Society approved. Great for shakes, recipes and mousses. 500g, 20 servings.",
    price: 30000,
    compareAtPrice: 36000,
    image: "/products/phd-plant-strawberry.jpg",
    category: "Protein",
    tags: ["vegan", "plant-based", "zero-sugar", "strawberry"],
    inStock: true,
    inventory: 18,
    featured: false,
    weight: "500g",
    servings: 20,
    createdAt: "2024-03-08",
    deliveryCost: 0,
  },
  {
    id: "9",
    name: "ON Gold Standard 100% Plant — Double Rich Chocolate (Large)",
    slug: "on-plant-protein-chocolate-large",
    description:
      "Optimum Nutrition Gold Standard 100% Plant Protein in Double Rich Chocolate. 24g high protein per serving. Complete amino acid profile. Vegan certified. 684g, 20 servings. Ideal for serious athletes committed to plant-based nutrition.",
    price: 45000,
    compareAtPrice: 52000,
    image: "/products/on-plant-choc2.jpg",
    category: "Protein",
    tags: ["vegan", "plant-based", "chocolate"],
    inStock: true,
    inventory: 15,
    featured: false,
    weight: "684g",
    servings: 20,
    createdAt: "2024-03-15",
    deliveryCost: 0,
  },
  {
    id: "10",
    name: "ON Serious Mass — Vanilla",
    slug: "on-serious-mass-vanilla",
    description:
      "Optimum Nutrition Serious Mass in Vanilla. The ultimate weight gain formula with 50g protein, 250g carbs, and 1,259 calories per serving. Supports muscle building and weight gain. 2.73kg (6LB), 8 servings.",
    price: 75000,
    compareAtPrice: 90000,
    image: "/products/on-serious-mass.jpg",
    category: "Protein",
    tags: ["mass", "bulking", "weight-gain"],
    inStock: true,
    inventory: 12,
    featured: true,
    weight: "2.73kg",
    servings: 8,
    createdAt: "2024-03-20",
    deliveryCost: 0,
  },
  {
    id: "11",
    name: "ON Gold Standard 100% Whey — Double Rich Chocolate",
    slug: "on-whey-double-rich-chocolate",
    description:
      "Optimum Nutrition Gold Standard 100% Whey in Double Rich Chocolate. The world's best-selling whey protein. 24g high protein and 5.5g naturally occurring BCAAs per serving. Low sugar, for muscle support and repair. 899g (2LB), 29 servings.",
    price: 42000,
    compareAtPrice: 50000,
    image: "/products/on-whey-chocolate.jpg",
    category: "Protein",
    tags: ["whey", "best-seller", "muscle"],
    inStock: true,
    inventory: 35,
    featured: true,
    weight: "899g",
    servings: 29,
    createdAt: "2024-04-01",
    deliveryCost: 0,
  },
  {
    id: "12",
    name: "PhD Diet Whey — Vanilla Crème",
    slug: "phd-diet-whey-vanilla",
    description:
      "PhD Diet Whey Lean Protein Powder in Vanilla Crème. 20g protein, only 124 calories per serving. Low sugar with added Acetyl-L-Carnitine, Green Tea Extract and CLA to support your lean goals. New & Improved formula. 1kg, 31 servings.",
    price: 32000,
    compareAtPrice: 40000,
    image: "/products/phd-diet-whey-vanilla.jpg",
    category: "Weight Loss",
    tags: ["diet", "lean", "low-calorie", "whey"],
    inStock: true,
    inventory: 28,
    featured: true,
    weight: "1kg",
    servings: 31,
    createdAt: "2024-04-05",
    deliveryCost: 0,
  },
];

let products: Product[] = [...initialProducts];

export function getProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category);
}

export function addProduct(product: Product): void {
  products.push(product);
}

export function updateProduct(updated: Product): void {
  const index = products.findIndex((p) => p.id === updated.id);
  if (index !== -1) {
    products[index] = updated;
  }
}

export function deleteProduct(id: string): void {
  products = products.filter((p) => p.id !== id);
}

export const reviews: Review[] = [
  {
    id: "r1",
    productId: "1",
    name: "Tunde Adeyemi",
    rating: 5,
    comment: "The French Vanilla flavour is amazing. Mixes really smooth and doesn't taste artificial at all. Great for post-workout.",
    date: "2024-03-15",
  },
  {
    id: "r2",
    productId: "1",
    name: "Funke Balogun",
    rating: 5,
    comment: "Love that it's plant-based and still hits 24g protein. Will definitely reorder. Fast delivery too!",
    date: "2024-03-10",
  },
  {
    id: "r3",
    productId: "2",
    name: "Chidi Okafor",
    rating: 4,
    comment: "Double Rich Chocolate is genuinely delicious. Mixes well with oat milk. Good amino acid profile.",
    date: "2024-02-28",
  },
  {
    id: "r4",
    productId: "4",
    name: "Seun Akinwale",
    rating: 5,
    comment: "The Fruit Punch pre-workout is incredible. Natural caffeine hits just right — no crash afterwards. 10/10.",
    date: "2024-03-20",
  },
  {
    id: "r5",
    productId: "4",
    name: "Emeka Nwosu",
    rating: 4,
    comment: "Great focus and clean energy. Much better than other pre-workouts I've tried. The taste is spot on.",
    date: "2024-03-05",
  },
  {
    id: "r6",
    productId: "3",
    name: "Yemi Adeleye",
    rating: 5,
    comment: "Best creatine powder I've used. Dissolves fast, no taste, and I've noticed real strength gains in 3 weeks.",
    date: "2024-03-18",
  },
  {
    id: "r7",
    productId: "6",
    name: "Dami Oluwaseun",
    rating: 5,
    comment: "PhD Chocolate Cookie is honestly one of the tastiest plant proteins I've had. Zero sugar and still tastes like a treat.",
    date: "2024-03-12",
  },
  {
    id: "r8",
    productId: "10",
    name: "Biodun Fashola",
    rating: 5,
    comment: "ON Serious Mass is the real deal for bulking. The vanilla flavour is great. Put on solid mass in 6 weeks.",
    date: "2024-03-25",
  },
];

export function getReviewsByProduct(productId: string): Review[] {
  return reviews.filter((r) => r.productId === productId);
}

export const promoCodes: PromoCode[] = [
  { code: "FEST10", discount: 10, type: "percent" },
  { code: "WELCOME", discount: 2000, type: "fixed" },
];

export function getPromoCode(code: string): PromoCode | undefined {
  return promoCodes.find(
    (p) => p.code.toLowerCase() === code.toLowerCase()
  );
}
