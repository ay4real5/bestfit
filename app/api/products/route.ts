import { NextRequest, NextResponse } from "next/server";
import { readProducts, addProductDb } from "@/lib/db";
import { Product } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");

    let products = readProducts();

    if (slug) {
      const product = products.find((p) => p.slug === slug);
      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
      return NextResponse.json(product);
    }

    if (category) {
      products = products.filter((p) => p.category === category);
    }

    if (featured === "true") {
      products = products.filter((p) => p.featured);
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const product: Product = await request.json();

    if (!product.name || !product.slug || !product.price) {
      return NextResponse.json(
        { error: "Name, slug, and price are required" },
        { status: 400 }
      );
    }

    if (!product.id) {
      product.id = Date.now().toString();
    }

    addProductDb(product);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json({ error: "Failed to add product" }, { status: 500 });
  }
}
