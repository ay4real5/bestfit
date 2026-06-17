import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const IS_VERCEL = !!process.env.VERCEL;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image must be under 5MB" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (IS_VERCEL) {
      // On Vercel, return a base64 data URL since filesystem is ephemeral
      const base64 = buffer.toString("base64");
      const url = `data:${file.type};base64,${base64}`;
      return NextResponse.json({ url });
    }

    // Locally, save to public/products/
    const ext = path.extname(file.name) || ".jpg";
    const safeName = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .toLowerCase();
    const uniqueName = `${safeName}-${Date.now()}${ext}`;

    const productsDir = path.join(process.cwd(), "public", "products");
    await mkdir(productsDir, { recursive: true });

    const filePath = path.join(productsDir, uniqueName);
    await writeFile(filePath, buffer);

    const url = `/products/${uniqueName}`;
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
