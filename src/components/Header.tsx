"use client";

import Link from "next/link";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

export default function Header() {
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header style={{
      position: "sticky",
      top: 0,
      zIndex: 100,
      background: "rgba(10,10,10,0.95)",
      backdropFilter: "blur(10px)",
      borderBottom: "1px solid var(--border)",
    }}>
      <nav style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "0 20px",
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        {/* Logo */}
        <Link href="/" style={{
          fontSize: 22,
          fontWeight: 900,
          letterSpacing: "0.15em",
          color: "white",
          textDecoration: "none",
        }}>
          ERTLONG
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: "flex", gap: 32 }} className="desktop-nav">
          {[
            ["LIVE INVENTORY", "/products"],
            ["HOW TO ORDER", "/#how-to-order"],
            ["CONTACT", "/#contact"],
          ].map(([label, href]) => (
            <Link key={label} href={href} style={{
              color: "#999",
              textDecoration: "none",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#999")}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Cart */}
        <Link href="/cart" style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          color: "white",
          textDecoration: "none",
          position: "relative",
        }}>
          <ShoppingBag size={20} />
          {totalItems > 0 && (
            <span style={{
              position: "absolute",
              top: -6,
              right: -8,
              background: "var(--accent)",
              color: "white",
              fontSize: 10,
              fontWeight: 700,
              borderRadius: "50%",
              width: 18,
              height: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              {totalItems}
            </span>
          )}
        </Link>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            background: "none",
            border: "none",
            color: "white",
            cursor: "pointer",
            display: "none",
          }}
          className="mobile-toggle"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{
          background: "var(--accent2)",
          borderTop: "1px solid var(--border)",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}>
          {[
            ["LIVE INVENTORY", "/products"],
            ["HOW TO ORDER", "/#how-to-order"],
            ["CONTACT", "/#contact"],
          ].map(([label, href]) => (
            <Link key={label} href={href} onClick={() => setMobileOpen(false)} style={{
              color: "#ccc",
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}>
              {label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </header>
  );
}
