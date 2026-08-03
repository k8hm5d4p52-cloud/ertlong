"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import { CartProvider, useCart } from "@/context/CartContext";
import { products } from "@/data/products";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";

function ProductDetailContent() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const product = products.find((p) => p.id === params.id);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <CartProvider>
        <Header />
        <div style={{ textAlign: "center", padding: "100px 20px" }}>
          <p style={{ color: "#666" }}>Product not found</p>
          <Link href="/products" style={{ color: "var(--accent)", marginTop: 16, display: "inline-block" }}>
            ← Back to products
          </Link>
        </div>
      </CartProvider>
    );
  }

  const categoryColors: Record<string, string> = {
    "in-stock": "#00c853",
    restocking: "#ff9100",
    discontinued: "#555",
  };

  const handleAdd = () => {
    if (!selectedSize || !selectedColor) return;
    addItem(product, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <>
      <Header />
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px 100px" }}>
        {/* Breadcrumb */}
        <Link href="/products" style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          color: "#666",
          fontSize: 12,
          textDecoration: "none",
          marginBottom: 32,
        }}>
          <ArrowLeft size={14} /> All Products
        </Link>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 48,
        }}>
          {/* Image */}
          <div style={{ position: "relative", aspectRatio: "1", background: "#111", borderRadius: 8, overflow: "hidden", border: "1px solid var(--border)" }}>
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>

          {/* Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Header */}
            <div>
              <div style={{
                display: "inline-block",
                padding: "4px 10px",
                borderRadius: 4,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                background: `${categoryColors[product.category]}20`,
                color: categoryColors[product.category],
                border: `1px solid ${categoryColors[product.category]}40`,
                marginBottom: 12,
              }}>
                {product.category === "in-stock" ? "In Stock · Ready to Ship" : product.category}
              </div>
              <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: "0.03em", color: "white" }}>
                {product.name}
              </h1>
              <div style={{ fontSize: 32, fontWeight: 900, color: "var(--accent)", marginTop: 8 }}>
                ${product.price}
              </div>
              {product.stock > 0 && (
                <div style={{ fontSize: 12, color: "#00c853", marginTop: 4 }}>
                  {product.stock} available
                </div>
              )}
            </div>

            <p style={{ fontSize: 14, color: "#888", lineHeight: 1.7 }}>
              {product.description}
            </p>

            {/* Sizes */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#666", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10 }}>
                Select Size
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      padding: "10px 18px",
                      border: `1px solid ${selectedSize === size ? "white" : "var(--border)"}`,
                      borderRadius: 4,
                      background: selectedSize === size ? "white" : "transparent",
                      color: selectedSize === size ? "black" : "#888",
                      fontWeight: 700,
                      fontSize: 12,
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#666", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10 }}>
                Select Color
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    style={{
                      padding: "10px 18px",
                      border: `1px solid ${selectedColor === color ? "var(--accent)" : "var(--border)"}`,
                      borderRadius: 4,
                      background: selectedColor === color ? "rgba(255,61,0,0.15)" : "transparent",
                      color: selectedColor === color ? "var(--accent)" : "#888",
                      fontWeight: 700,
                      fontSize: 12,
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAdd}
              disabled={!selectedSize || !selectedColor}
              style={{
                padding: "16px",
                background: added
                  ? "#00c853"
                  : !selectedSize || !selectedColor
                  ? "#333"
                  : "var(--accent)",
                color: "white",
                border: "none",
                borderRadius: 4,
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: !selectedSize || !selectedColor ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transition: "background 0.2s",
              }}
            >
              {added ? (
                <>
                  <Check size={16} /> Added to Cart
                </>
              ) : !selectedSize || !selectedColor ? (
                "Select Size & Color"
              ) : (
                "Add to Cart"
              )}
            </button>

            <Link href="/cart" style={{
              display: "block",
              textAlign: "center",
              padding: "14px",
              border: "1px solid var(--border)",
              borderRadius: 4,
              color: "#888",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textDecoration: "none",
              transition: "border-color 0.2s, color 0.2s",
            }}>
              View Cart
            </Link>

            {/* Info */}
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                ["SKU", product.id.toUpperCase()],
                ["Sizes Available", product.sizes.join(" / ")],
                ["Colors Available", product.colors.join(" / ")],
                ["Stock Status", product.category === "in-stock" ? "In Stock — Ships Same Day" : product.category === "restocking" ? "Restocking — Check Availability" : "Discontinued"],
              ].map(([label, value]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                  <span style={{ color: "#555", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>
                  <span style={{ color: "#999" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default function ProductDetailPage() {
  return (
    <CartProvider>
      <ProductDetailContent />
    </CartProvider>
  );
}
