import Header from "@/components/Header";
import ProductGrid from "@/components/ProductGrid";
import { CartProvider } from "@/context/CartContext";
import { getProducts } from "@/data/products";

export default async function ProductsPage() {
  const allProducts = await getProducts();

  const inStock = allProducts.filter((p) => p.category === "in-stock");
  const restocking = allProducts.filter((p) => p.category === "restocking");
  const discontinued = allProducts.filter((p) => p.category === "discontinued");

  return (
    <CartProvider>
      <Header />
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 20px 100px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span className="live-dot" style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff3d00", display: "inline-block" }} />
            <span style={{ color: "#ff3d00", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em" }}>
              LIVE INVENTORY
            </span>
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 900, letterSpacing: "0.05em" }}>ALL PRODUCTS</h1>
          <p style={{ color: "#666", fontSize: 13, marginTop: 8 }}>Updated every morning</p>
        </div>

        {/* Categories */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 48, flexWrap: "wrap" }}>
          {[
            { label: "In Stock", items: inStock.length, color: "#00c853" },
            { label: "Restocking", items: restocking.length, color: "#ff9100" },
            { label: "Discontinued", items: discontinued.length, color: "#555" },
          ].map(({ label, items, color }) => (
            <a key={label} href={`#${label.toLowerCase().replace(" ", "-")}`} style={{
              padding: "8px 20px",
              border: `1px solid ${color}40`,
              borderRadius: 20,
              color,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textDecoration: "none",
              background: `${color}10`,
            }}>
              {label} ({items})
            </a>
          ))}
        </div>

        {/* In Stock */}
        <div id="in-stock" style={{ marginBottom: 64 }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.15em", color: "#00c853", marginBottom: 24, textTransform: "uppercase" }}>
            · In Stock · Ready to Ship
          </h2>
          <ProductGrid products={inStock} />
        </div>

        {/* Restocking */}
        {restocking.length > 0 && (
          <div id="restocking" style={{ marginBottom: 64 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.15em", color: "#ff9100", marginBottom: 24, textTransform: "uppercase" }}>
              · Restocking
            </h2>
            <ProductGrid products={restocking} />
          </div>
        )}

        {/* Discontinued */}
        {discontinued.length > 0 && (
          <div id="discontinued">
            <h2 style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.15em", color: "#555", marginBottom: 24, textTransform: "uppercase" }}>
              · Discontinued
            </h2>
            <ProductGrid products={discontinued} />
          </div>
        )}
      </main>
    </CartProvider>
  );
}
