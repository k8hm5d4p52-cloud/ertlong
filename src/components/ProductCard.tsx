"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";

const categoryLabels = {
  "in-stock": { text: "In Stock · Ready to Ship", color: "#00c853" },
  "restocking": { text: "Restocking", color: "#ff9100" },
  "discontinued": { text: "Discontinued", color: "#555" },
};

export default function ProductCard({ product }: { product: Product }) {
  const cat = categoryLabels[product.category];

  return (
    <Link href={`/products/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
      <div style={{
        background: "var(--accent2)",
        border: "1px solid var(--border)",
        borderRadius: 8,
        overflow: "hidden",
        transition: "transform 0.2s, border-color 0.2s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
        (e.currentTarget as HTMLDivElement).style.borderColor = "#444";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
      }}
      >
        {/* Image */}
        <div style={{ position: "relative", aspectRatio: "1", background: "#111" }}>
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            style={{ objectFit: "cover" }}
          />
          {/* Stock badge */}
          <div style={{
            position: "absolute",
            top: 10,
            left: 10,
            background: "rgba(0,0,0,0.8)",
            padding: "4px 8px",
            borderRadius: 4,
          }}>
            <span style={{
              color: cat.color,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}>
              {cat.text}
            </span>
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: "14px" }}>
          <div style={{ fontSize: 11, color: "#555", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>
            {product.category !== "discontinued" ? `${product.stock} available` : ""}
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "white", marginBottom: 8 }}>
            {product.name}
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "var(--accent)" }}>
            ${product.price}
          </div>
          <div style={{ fontSize: 11, color: "#666", marginTop: 4 }}>
            {product.sizes.join(" / ")}
          </div>
        </div>
      </div>
    </Link>
  );
}
