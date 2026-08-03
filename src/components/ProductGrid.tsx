"use client";

import ProductCard from "./ProductCard";
import { Product } from "@/types";

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
      gap: 16,
    }}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
