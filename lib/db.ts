import fs from "fs";
import path from "path";
import { Product } from "./types";
import { initialProducts } from "./data";

const DB_PATH = path.join(process.cwd(), "data", "products.json");

function ensureDataDir() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function seedIfNeeded() {
  ensureDataDir();
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(initialProducts, null, 2), "utf-8");
  }
}

export function readProducts(): Product[] {
  seedIfNeeded();
  try {
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(raw) as Product[];
  } catch {
    return [...initialProducts];
  }
}

export function writeProducts(products: Product[]): void {
  ensureDataDir();
  fs.writeFileSync(DB_PATH, JSON.stringify(products, null, 2), "utf-8");
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
