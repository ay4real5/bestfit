import fs from "fs";
import path from "path";
import { Product } from "./types";
import { initialProducts } from "./data";

const IS_VERCEL = !!process.env.VERCEL;

// On Vercel, use /tmp (writable). Locally, use project data/ folder.
const DB_PATH = IS_VERCEL
  ? path.join("/tmp", "products.json")
  : path.join(process.cwd(), "data", "products.json");

// In-memory fallback for when filesystem is completely unavailable
let memoryProducts: Product[] | null = null;

function ensureDataDir() {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  } catch {
    // Silently fail — will use in-memory fallback
  }
}

function seedIfNeeded() {
  try {
    ensureDataDir();
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify(initialProducts, null, 2), "utf-8");
    }
  } catch {
    // Could not write seed — will use initialProducts as fallback
  }
}

export function readProducts(): Product[] {
  seedIfNeeded();
  try {
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(raw) as Product[];
  } catch {
    return memoryProducts ?? [...initialProducts];
  }
}

export function writeProducts(products: Product[]): void {
  memoryProducts = products;
  try {
    ensureDataDir();
    fs.writeFileSync(DB_PATH, JSON.stringify(products, null, 2), "utf-8");
  } catch {
    // Filesystem write failed — data saved in memory only
  }
}

export function getProductById(id: string): Product | undefined {
  return readProducts().find((p) => p.id === id);
}

export function getProductBySlugDb(slug: string): Product | undefined {
  return readProducts().find((p) => p.slug === slug);
}

export function getFeaturedProductsDb(): Product[] {
  return readProducts().filter((p) => p.featured);
}

export function getProductsByCategoryDb(category: string): Product[] {
  return readProducts().filter((p) => p.category === category);
}

export function addProductDb(product: Product): void {
  const products = readProducts();
  products.push(product);
  writeProducts(products);
}

export function updateProductDb(updated: Product): void {
  const products = readProducts();
  const index = products.findIndex((p) => p.id === updated.id);
  if (index !== -1) {
    products[index] = updated;
    writeProducts(products);
  }
}

export function deleteProductDb(id: string): void {
  const products = readProducts().filter((p) => p.id !== id);
  writeProducts(products);
}
