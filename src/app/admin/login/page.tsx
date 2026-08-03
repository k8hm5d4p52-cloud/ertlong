"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";

const ADMIN_EMAIL = "admin@ertlong.com";
const ADMIN_PASSWORD = "ertlong2024";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate network delay for realism
    await new Promise((r) => setTimeout(r, 600));

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Store simple session flag in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("ertlong_admin", "true");
        localStorage.setItem("ertlong_admin_email", email);
      }
      router.push("/admin/dashboard");
    } else {
      setError("Invalid email or password.");
      setLoading(false);
    }
  };

  return (
    <CartProvider>
    <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#fff" }}>
      <Header />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 64px)",
          padding: "40px 20px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 400,
            background: "#1a1a1a",
            border: "1px solid #2a2a2a",
            borderRadius: 12,
            padding: "40px",
          }}
        >
          {/* Logo / Title */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.2em",
                color: "#ff3d00",
                fontWeight: 700,
                marginBottom: 8,
              }}
            >
              ERTLONG
            </div>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 900,
                letterSpacing: "0.1em",
                color: "#fff",
              }}
            >
              Admin Portal
            </h1>
            <p
              style={{
                fontSize: 12,
                color: "#666",
                marginTop: 8,
              }}
            >
              Sign in to manage your products
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  color: "#888",
                  marginBottom: 8,
                  textTransform: "uppercase",
                }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ertlong.com"
                required
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  background: "#111",
                  border: "1px solid #2a2a2a",
                  borderRadius: 6,
                  color: "#fff",
                  fontSize: 14,
                  outline: "none",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#ff3d00")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#2a2a2a")}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  color: "#888",
                  marginBottom: 8,
                  textTransform: "uppercase",
                }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  background: "#111",
                  border: "1px solid #2a2a2a",
                  borderRadius: 6,
                  color: "#fff",
                  fontSize: 14,
                  outline: "none",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#ff3d00")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#2a2a2a")}
              />
            </div>

            {error && (
              <div
                style={{
                  padding: "10px 14px",
                  background: "rgba(255,61,0,0.1)",
                  border: "1px solid rgba(255,61,0,0.3)",
                  borderRadius: 6,
                  fontSize: 12,
                  color: "#ff3d00",
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                background: loading ? "#333" : "#ff3d00",
                border: "none",
                borderRadius: 6,
                color: "#fff",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background 0.2s",
                marginTop: 8,
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: 24 }}>
            <Link
              href="/"
              style={{
                fontSize: 11,
                color: "#555",
                textDecoration: "none",
                letterSpacing: "0.05em",
              }}
            >
              ← Back to store
            </Link>
          </div>
        </div>
      </div>
    </div>
    </CartProvider>
  );
}
