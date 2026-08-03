import { getProducts } from "@/data/products";
import ProductDetailClient from "./ProductDetailClient";
import Link from "next/link";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const products = await getProducts();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#666", fontSize: 14 }}>Product not found</p>
          <Link href="/products" style={{ color: "#ff3d00", marginTop: 16, display: "inline-block", fontSize: 12 }}>
            ← Back to products
          </Link>
        </div>
      </div>
    );
  }

  return <ProductDetailClient product={product} />;
}
