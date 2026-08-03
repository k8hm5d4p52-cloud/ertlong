"use client";

import { useState } from "react";
import Header from "@/components/Header";
import { CartProvider, useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, MessageCircle } from "lucide-react";

function CartContent() {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "details" | "done">("cart");
  const [shipping, setShipping] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    country: "",
    zip: "",
    phone: "",
    note: "",
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setShipping((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleWhatsAppCheckout = () => {
    if (!shipping.name || !shipping.address) return;
    const itemsList = items
      .map((i) => `• ${i.product.name} | Size: ${i.size} | Color: ${i.color} | Qty: ${i.quantity} | $${i.product.price}`)
      .join("\n");
    const msg = encodeURIComponent(
      `🛒 *ERTLONG ORDER*\n\n*Items:*\n${itemsList}\n\n*Total:* $${totalPrice}\n\n*Shipping Details:*\nName: ${shipping.name}\nEmail: ${shipping.email}\nAddress: ${shipping.address}, ${shipping.city}, ${shipping.country} ${shipping.zip}\nPhone: ${shipping.phone}\n\nNote: ${shipping.note}`
    );
    window.open(`https://wa.me/+8613420352140?text=${msg}`, "_blank");
    setCheckoutStep("done");
  };

  if (items.length === 0 && checkoutStep !== "done") {
    return (
      <>
        <Header />
        <main style={{ maxWidth: 600, margin: "0 auto", padding: "100px 20px", textAlign: "center" }}>
          <ShoppingBag size={48} style={{ color: "#333", marginBottom: 16 }} />
          <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 8 }}>Your Cart is Empty</h1>
          <p style={{ color: "#666", marginBottom: 32 }}>Add some products to get started.</p>
          <Link href="/products" style={{
            display: "inline-block",
            background: "var(--accent)",
            color: "white",
            padding: "14px 32px",
            borderRadius: 4,
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            textDecoration: "none",
          }}>
            Browse Products
          </Link>
        </main>
      </>
    );
  }

  if (checkoutStep === "done") {
    return (
      <>
        <Header />
        <main style={{ maxWidth: 600, margin: "0 auto", padding: "100px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 60, marginBottom: 16 }}>✅</div>
          <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>Order Received!</h1>
          <p style={{ color: "#888", marginBottom: 8 }}>We will send you QC photos within 24-48 hours.</p>
          <p style={{ color: "#666", fontSize: 13, marginBottom: 32 }}>Delivery: 12-15 business days worldwide.</p>
          <Link href="/products" style={{
            display: "inline-block",
            background: "var(--accent)",
            color: "white",
            padding: "14px 32px",
            borderRadius: 4,
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            textDecoration: "none",
          }}>
            Continue Shopping
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main style={{ maxWidth: 1000, margin: "0 auto", padding: "60px 20px 100px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: "0.05em", marginBottom: 40 }}>YOUR CART</h1>

        {checkoutStep === "cart" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 40 }}>
            {/* Items */}
            <div>
              {items.map((item) => (
                <div key={`${item.product.id}-${item.size}-${item.color}`} style={{
                  display: "flex",
                  gap: 16,
                  padding: "20px 0",
                  borderBottom: "1px solid var(--border)",
                }}>
                  {/* Image */}
                  <div style={{ width: 100, height: 100, position: "relative", borderRadius: 6, overflow: "hidden", background: "#111", flexShrink: 0 }}>
                    <Image src={item.product.images[0]} alt={item.product.name} fill style={{ objectFit: "cover" }} />
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "white", marginBottom: 4 }}>{item.product.name}</div>
                    <div style={{ fontSize: 11, color: "#666", marginBottom: 8 }}>
                      {item.size} / {item.color}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--accent)" }}>
                      ${item.product.price}
                    </div>
                  </div>

                  {/* Quantity + Remove */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "space-between" }}>
                    <button onClick={() => removeItem(item.product.id, item.size, item.color)} style={{
                      background: "none",
                      border: "none",
                      color: "#555",
                      cursor: "pointer",
                      padding: 4,
                    }}>
                      <Trash2 size={16} />
                    </button>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)} style={{
                        background: "var(--accent2)",
                        border: "1px solid var(--border)",
                        color: "#888",
                        width: 28,
                        height: 28,
                        borderRadius: 4,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                        <Minus size={12} />
                      </button>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "white", width: 24, textAlign: "center" }}>
                        {item.quantity}
                      </span>
                      <button onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)} style={{
                        background: "var(--accent2)",
                        border: "1px solid var(--border)",
                        color: "#888",
                        width: 28,
                        height: 28,
                        borderRadius: 4,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div style={{
              background: "var(--accent2)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: 24,
              height: "fit-content",
              position: "sticky",
              top: 80,
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#666", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>
                Order Summary
              </div>
              {items.map((item) => (
                <div key={`${item.product.id}-${item.size}-${item.color}`} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 10,
                  fontSize: 13,
                }}>
                  <span style={{ color: "#888" }}>
                    {item.product.name} × {item.quantity}
                  </span>
                  <span style={{ color: "#ccc" }}>
                    ${item.product.price * item.quantity}
                  </span>
                </div>
              ))}
              <div style={{ borderTop: "1px solid var(--border)", marginTop: 16, paddingTop: 16, display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>Total</span>
                <span style={{ fontWeight: 900, fontSize: 18, color: "var(--accent)" }}>${totalPrice}</span>
              </div>
              <button onClick={() => setCheckoutStep("details")} style={{
                width: "100%",
                marginTop: 20,
                padding: "14px",
                background: "var(--accent)",
                color: "white",
                border: "none",
                borderRadius: 4,
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}>
                Checkout
              </button>
              <p style={{ textAlign: "center", fontSize: 10, color: "#444", marginTop: 12 }}>
                PayPal / Crypto available at checkout
              </p>
            </div>
          </div>
        )}

        {checkoutStep === "details" && (
          <div style={{ maxWidth: 600 }}>
            <button onClick={() => setCheckoutStep("cart")} style={{
              background: "none",
              border: "none",
              color: "#666",
              cursor: "pointer",
              fontSize: 12,
              marginBottom: 24,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}>
              ← Back to Cart
            </button>

            <h2 style={{ fontSize: 18, fontWeight: 900, marginBottom: 24 }}>Shipping Details</h2>

            <div style={{ display: "grid", gap: 16 }}>
              {[
                { name: "name", label: "Full Name", placeholder: "John Doe" },
                { name: "email", label: "Email", placeholder: "john@email.com" },
                { name: "phone", label: "Phone / WhatsApp", placeholder: "+1 234 567 8900" },
                { name: "address", label: "Full Address", placeholder: "123 Main St, Apt 4" },
                { name: "city", label: "City", placeholder: "New York" },
                { name: "country", label: "Country", placeholder: "United States" },
                { name: "zip", label: "ZIP / Postal Code", placeholder: "10001" },
              ].map(({ name, label, placeholder }) => (
                <div key={name}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#666", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                    {label} <span style={{ color: "var(--accent)" }}>*</span>
                  </label>
                  <input
                    name={name}
                    value={shipping[name as keyof typeof shipping]}
                    onChange={handleInput}
                    placeholder={placeholder}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      background: "var(--accent2)",
                      border: "1px solid var(--border)",
                      borderRadius: 4,
                      color: "white",
                      fontSize: 14,
                      outline: "none",
                    }}
                  />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#666", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                  Order Note (Optional)
                </label>
                <textarea
                  name="note"
                  value={shipping.note}
                  onChange={handleInput}
                  placeholder="Any special requests..."
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    background: "var(--accent2)",
                    border: "1px solid var(--border)",
                    borderRadius: 4,
                    color: "white",
                    fontSize: 14,
                    outline: "none",
                    resize: "vertical",
                  }}
                />
              </div>
            </div>

            <div style={{
              marginTop: 24,
              padding: 20,
              background: "var(--accent2)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              marginBottom: 24,
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#666", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
                Order Total
              </div>
              <div style={{ fontSize: 24, fontWeight: 900, color: "var(--accent)" }}>
                ${totalPrice}
              </div>
              <div style={{ fontSize: 11, color: "#555", marginTop: 4 }}>
                + Shipping calculated after order review
              </div>
            </div>

            {/* Payment Methods */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#666", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
                Payment Method
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                {["PayPal", "Crypto", "Alipay"].map((p) => (
                  <span key={p} style={{
                    padding: "8px 16px",
                    border: "1px solid var(--border)",
                    borderRadius: 4,
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#888",
                  }}>
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <button onClick={handleWhatsAppCheckout} style={{
              width: "100%",
              padding: "16px",
              background: "#25d366",
              color: "white",
              border: "none",
              borderRadius: 4,
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: "0.05em",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}>
              <MessageCircle size={18} /> Send Order via WhatsApp
            </button>

            <p style={{ textAlign: "center", fontSize: 11, color: "#444", marginTop: 12 }}>
              You will be redirected to WhatsApp to complete your order. We accept PayPal, Crypto & Alipay.
            </p>
          </div>
        )}
      </main>
    </>
  );
}

export default function CartPage() {
  return (
    <CartProvider>
      <CartContent />
    </CartProvider>
  );
}
