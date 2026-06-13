import { Suspense } from "react";
import ProductsContent from "./ProductsContent";

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8 md:px-6">Loading products...</div>}>
      <ProductsContent />
    </Suspense>
  );
}

