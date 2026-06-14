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
    name: "Whey Protein Isolate",
    slug: "whey-protein-isolate",
    description:
      "Premium 100% whey protein isolate with 25g protein per serving. Low carb, fast absorbing, perfect for post-workout recovery. Available in Chocolate, Vanilla, and Strawberry flavors.",
    price: 45000,
    compareAtPrice: 55000,
    image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&h=600&fit=crop",
    category: "Protein",
    tags: ["best-seller", "recovery"],
    inStock: true,
    inventory: 150,
    featured: true,
    weight: "2kg",
    servings: 60,
    createdAt: "2024-01-15",
    deliveryCost: 0,
  },
  {
    id: "2",
    name: "Pre-Workout Explosion",
    slug: "pre-workout-explosion",
    description:
      "High-intensity pre-workout formula with 300mg caffeine, beta-alanine, and citrulline malate for insane pumps and endurance. Fruit Punch flavor.",
    price: 28000,
    compareAtPrice: 35000,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop",
    category: "Pre-Workout",
    tags: ["energy", "focus"],
    inStock: true,
    inventory: 85,
    featured: true,
    weight: "300g",
    servings: 30,
    createdAt: "2024-02-10",
    deliveryCost: 0,
  },
  {
    id: "3",
    name: "Multivitamin Complex",
    slug: "multivitamin-complex",
    description:
      "Complete daily multivitamin with 23 essential vitamins and minerals. Supports immune health, energy metabolism, and overall wellness.",
    price: 18000,
    image: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=600&h=600&fit=crop",
    category: "Vitamins",
    tags: ["health", "daily"],
    inStock: true,
    inventory: 200,
    featured: false,
    weight: "120 tablets",
    servings: 120,
    createdAt: "2024-01-20",
    deliveryCost: 0,
  },
  {
    id: "4",
    name: "Fat Burner Pro",
    slug: "fat-burner-pro",
    description:
      "Advanced thermogenic fat burner with green tea extract, CLA, and L-carnitine. Boosts metabolism and supports weight management goals.",
    price: 22000,
    compareAtPrice: 28000,
    image: "https://images.unsplash.com/photo-1612532275214-e4ca76d0e4d1?w=600&h=600&fit=crop",
    category: "Weight Loss",
    tags: ["weight-loss", "metabolism"],
    inStock: true,
    inventory: 60,
    featured: true,
    weight: "90 capsules",
    servings: 90,
    createdAt: "2024-03-05",
    deliveryCost: 0,
  },
  {
    id: "5",
    name: "BCAA Recovery",
    slug: "bcaa-recovery",
    description:
      "2:1:1 ratio BCAAs with added glutamine for muscle recovery and reduced soreness. Watermelon flavor. Zero sugar.",
    price: 16500,
    image: "https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=600&h=600&fit=crop",
    category: "Amino Acids",
    tags: ["recovery", "intra-workout"],
    inStock: true,
    inventory: 110,
    featured: false,
    weight: "400g",
    servings: 40,
    createdAt: "2024-02-15",
    deliveryCost: 0,
  },
  {
    id: "6",
    name: "Creatine Monohydrate",
    slug: "creatine-monohydrate",
    description:
      "Pure micronized creatine monohydrate. 5g per serving. Clinically proven to increase strength, power, and lean muscle mass. Unflavored.",
    price: 14000,
    compareAtPrice: 18000,
    image: "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=600&h=600&fit=crop",
    category: "Creatine",
    tags: ["strength", "power"],
    inStock: true,
    inventory: 180,
    featured: true,
    weight: "500g",
    servings: 100,
    createdAt: "2024-01-08",
    deliveryCost: 0,
  },
  {
    id: "7",
    name: "Sleep & Recovery",
    slug: "sleep-recovery",
    description:
      "Nighttime recovery formula with melatonin, ZMA, and magnesium. Promotes deep sleep and overnight muscle repair.",
    price: 20000,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop",
    category: "Recovery",
    tags: ["sleep", "recovery"],
    inStock: true,
    inventory: 75,
    featured: false,
    weight: "120 capsules",
    servings: 30,
    createdAt: "2024-03-12",
    deliveryCost: 0,
  },
  {
    id: "8",
    name: "Omega-3 Fish Oil",
    slug: "omega-3-fish-oil",
    description:
      "High-potency Omega-3 fatty acids with 1000mg EPA/DHA per serving. Supports heart health, joint mobility, and brain function.",
    price: 13500,
    image: "https://images.unsplash.com/photo-1535914254981-b5012eebbd15?w=600&h=600&fit=crop",
    category: "Vitamins",
    tags: ["heart-health", "joints"],
    inStock: true,
    inventory: 130,
    featured: false,
    weight: "180 softgels",
    servings: 180,
    createdAt: "2024-02-28",
    deliveryCost: 0,
  },
  {
    id: "9",
    name: "Mass Gainer Elite",
    slug: "mass-gainer-elite",
    description:
      "High-calorie mass gainer with 50g protein, 250g carbs, and added creatine. Perfect for hard gainers looking to pack on size. Chocolate flavor.",
    price: 58000,
    compareAtPrice: 70000,
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&h=600&fit=crop",
    category: "Protein",
    tags: ["mass", "bulking"],
    inStock: true,
    inventory: 45,
    featured: true,
    weight: "5kg",
    servings: 25,
    createdAt: "2024-03-20",
    deliveryCost: 0,
  },
  {
    id: "10",
    name: "Energy & Focus Stack",
    slug: "energy-focus-stack",
    description:
      "Nootropic energy blend with caffeine, L-theanine, and B-vitamins. Clean energy without the crash. 60 capsules.",
    price: 24000,
    image: "https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=600&h=600&fit=crop",
    category: "Pre-Workout",
    tags: ["energy", "focus", "nootropic"],
    inStock: true,
    inventory: 95,
    featured: false,
    weight: "60 capsules",
    servings: 60,
    createdAt: "2024-04-01",
    deliveryCost: 0,
  },
  {
    id: "11",
    name: "Collagen Peptides",
    slug: "collagen-peptides",
    description:
      "Hydrolyzed collagen peptides for skin, hair, nails, and joint support. Unflavored, dissolves easily. 20g per serving.",
    price: 21000,
    image: "https://images.unsplash.com/photo-1505751171710-1f6d0ace5a85?w=600&h=600&fit=crop",
    category: "Recovery",
    tags: ["skin", "joints", "beauty"],
    inStock: true,
    inventory: 70,
    featured: false,
    weight: "400g",
    servings: 40,
    createdAt: "2024-03-28",
    deliveryCost: 0,
  },
  {
    id: "12",
    name: "Testosterone Support",
    slug: "testosterone-support",
    description:
      "Natural testosterone booster with D-aspartic acid, fenugreek, and zinc. Supports muscle growth, strength, and vitality.",
    price: 30000,
    compareAtPrice: 38000,
    image: "https://images.unsplash.com/photo-1554284126-aa88f22d8b74?w=600&h=600&fit=crop",
    category: "Vitamins",
    tags: ["hormone", "strength"],
    inStock: true,
    inventory: 55,
    featured: true,
    weight: "120 capsules",
    servings: 30,
    createdAt: "2024-04-10",
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
    name: "Mike Johnson",
    rating: 5,
    comment: "Best protein I've ever used. Mixes perfectly with no clumps and tastes amazing.",
    date: "2024-03-15",
  },
  {
    id: "r2",
    productId: "1",
    name: "Sarah Williams",
    rating: 5,
    comment: "Chocolate flavor is incredible. Great value for the 2kg tub. Will buy again!",
    date: "2024-03-10",
  },
  {
    id: "r3",
    productId: "1",
    name: "David Chen",
    rating: 4,
    comment: "Good quality protein. Fast delivery too. Only wish there was a banana flavor.",
    date: "2024-02-28",
  },
  {
    id: "r4",
    productId: "2",
    name: "Alex Rivera",
    rating: 5,
    comment: "Insane energy! First time using this pre-workout and the pumps are unreal.",
    date: "2024-03-20",
  },
  {
    id: "r5",
    productId: "2",
    name: "James Patel",
    rating: 4,
    comment: "Great focus and energy. The fruit punch flavor is pretty good.",
    date: "2024-03-05",
  },
  {
    id: "r6",
    productId: "4",
    name: "Emma Thompson",
    rating: 5,
    comment: "Been using this for 3 weeks and already seeing results. Highly recommend!",
    date: "2024-03-18",
  },
  {
    id: "r7",
    productId: "6",
    name: "Ryan Garcia",
    rating: 5,
    comment: "Pure creatine monohydrate at a great price. Nothing fancy, just works.",
    date: "2024-03-12",
  },
  {
    id: "r8",
    productId: "9",
    name: "Chris Lee",
    rating: 4,
    comment: "Mass gainer is thick and creamy. Helped me put on 5kg in a month.",
    date: "2024-03-25",
  },
];

export function getReviewsByProduct(productId: string): Review[] {
  return reviews.filter((r) => r.productId === productId);
}

export const promoCodes: PromoCode[] = [
  { code: "FEST10", discount: 10, type: "percent" },
  { code: "WELCOME", discount: 5, type: "fixed" },
];

export function getPromoCode(code: string): PromoCode | undefined {
  return promoCodes.find(
    (p) => p.code.toLowerCase() === code.toLowerCase()
  );
}
