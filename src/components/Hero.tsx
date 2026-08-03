"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section style={{
      minHeight: "90vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "80px 20px",
      background: "radial-gradient(ellipse at center, #1a1a1a 0%, #0a0a0a 70%)",
    }}>
      {/* Live indicator */}
      <div style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        background: "rgba(255,61,0,0.1)",
        border: "1px solid rgba(255,61,0,0.3)",
        borderRadius: 20,
        padding: "6px 16px",
        marginBottom: 32,
      }}>
        <span className="live-dot" style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#ff3d00",
          display: "inline-block",
        }} />
        <span style={{ color: "#ff3d00", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em" }}>
          LIVE INVENTORY
        </span>
      </div>

      <h1 style={{
        fontSize: "clamp(48px, 10vw, 100px)",
        fontWeight: 900,
        letterSpacing: "0.05em",
        lineHeight: 1,
        marginBottom: 16,
      }}>
        ERTLONG
      </h1>

      <p style={{
        fontSize: 13,
        letterSpacing: "0.3em",
        color: "#666",
        textTransform: "uppercase",
        marginBottom: 48,
      }}>
        Premium Streetwear / Live Stock / Worldwide
      </p>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
        <Link href="/products" style={{
          background: "var(--accent)",
          color: "white",
          padding: "14px 36px",
          borderRadius: 4,
          fontWeight: 700,
          fontSize: 13,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          textDecoration: "none",
          transition: "opacity 0.2s",
        }}>
          Shop Now
        </Link>
        <Link href="/#how-to-order" style={{
          border: "1px solid var(--border)",
          color: "#ccc",
          padding: "14px 36px",
          borderRadius: 4,
          fontWeight: 600,
          fontSize: 13,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          textDecoration: "none",
          transition: "border-color 0.2s, color 0.2s",
        }}>
          How to Order
        </Link>
      </div>

      {/* Quick Stats */}
      <div style={{
        display: "flex",
        gap: 48,
        marginTop: 80,
        flexWrap: "wrap",
        justifyContent: "center",
      }}>
        {[
          ["12-15", "Days Delivery"],
          ["QC", "Before Shipping"],
          ["PayPal / Crypto", "Payment"],
        ].map(([value, label]) => (
          <div key={label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: "white" }}>{value}</div>
            <div style={{ fontSize: 10, color: "#555", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 4 }}>
              {label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
