import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import { CartProvider } from "@/context/CartContext";
import { getProducts } from "@/data/products";

export default async function HomePage() {
  const allProducts = await getProducts();
  const inStock = allProducts.filter((p) => p.category === "in-stock");

  return (
    <CartProvider>
      <Header />
      <main>
        <Hero />

        {/* Live Inventory Section */}
        <section style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 20px" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
            }}>
              <span className="live-dot" style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#ff3d00",
                display: "inline-block",
              }} />
              <span style={{
                color: "#ff3d00",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.15em",
              }}>
                LIVE INVENTORY
              </span>
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: "0.05em" }}>
              Available Styles
            </h2>
            <p style={{ color: "#666", fontSize: 13, marginTop: 8 }}>
              In-stock items can ship same day. Updated every morning.
            </p>
          </div>

          <ProductGrid products={inStock} />

          <div style={{ textAlign: "center", marginTop: 40 }}>
            <a href="/products" style={{
              display: "inline-block",
              background: "transparent",
              border: "1px solid var(--border)",
              color: "#999",
              padding: "12px 32px",
              borderRadius: 4,
              fontWeight: 600,
              fontSize: 12,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textDecoration: "none",
              transition: "border-color 0.2s, color 0.2s",
            }}>
              View All Products
            </a>
          </div>
        </section>

        {/* How to Order */}
        <section id="how-to-order" style={{
          background: "var(--accent2)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          padding: "80px 20px",
        }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <h2 style={{
              textAlign: "center",
              fontSize: 24,
              fontWeight: 900,
              letterSpacing: "0.1em",
              marginBottom: 48,
            }}>
              HOW TO ORDER
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
              {[
                {
                  step: "01",
                  title: "Choose Item & Size",
                  desc: "Check live stock and select your preferred colour.",
                },
                {
                  step: "02",
                  title: "Complete Payment",
                  desc: "Send your shipping details after payment via PayPal or Crypto.",
                },
                {
                  step: "03",
                  title: "Review QC Photos",
                  desc: "Normally ready within 1-2 days for in-stock items.",
                },
                {
                  step: "04",
                  title: "Approve & Ship",
                  desc: "Typical delivery is 12-15 days, depending on destination.",
                },
              ].map(({ step, title, desc }) => (
                <div key={step} style={{ padding: 24, background: "var(--background)", borderRadius: 8, border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: 48, fontWeight: 900, color: "var(--accent)", marginBottom: 12 }}>
                    {step}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "white", marginBottom: 8 }}>
                    {title}
                  </div>
                  <div style={{ fontSize: 12, color: "#777", lineHeight: 1.6 }}>
                    {desc}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 40 }}>
              {["PayPal", "Crypto", "Alipay"].map((p) => (
                <span key={p} style={{
                  padding: "6px 16px",
                  border: "1px solid var(--border)",
                  borderRadius: 4,
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#888",
                  letterSpacing: "0.1em",
                }}>
                  {p}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section id="contact" style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {[
              {
                title: "Shipping Protection",
                desc: "Support is available if a parcel is lost, returned, or damaged.",
              },
              {
                title: "QC Before Shipping",
                desc: "You review the item photos before it leaves our warehouse.",
              },
              {
                title: "Dedicated Support",
                desc: "Direct help from stock check through delivery.",
              },
            ].map(({ title, desc }) => (
              <div key={title} style={{
                padding: 24,
                border: "1px solid var(--border)",
                borderRadius: 8,
                background: "var(--accent2)",
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "white", marginBottom: 8, letterSpacing: "0.05em" }}>
                  {title}
                </div>
                <div style={{ fontSize: 12, color: "#777", lineHeight: 1.6 }}>
                  {desc}
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 64, padding: "40px", background: "var(--accent2)", borderRadius: 8, border: "1px solid var(--border)" }}>
            <div style={{ fontSize: 11, color: "#555", letterSpacing: "0.2em", marginBottom: 12 }}>
              NEED HELP?
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 8 }}>
              Contact Us via WhatsApp
            </div>
            <div style={{ fontSize: 13, color: "#777", marginBottom: 20 }}>
              +1 234 567 8900
            </div>
            <a href="https://wa.me/12345678900" target="_blank" rel="noopener noreferrer" style={{
              display: "inline-block",
              background: "#25d366",
              color: "white",
              padding: "12px 28px",
              borderRadius: 4,
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: "0.1em",
              textDecoration: "none",
            }}>
              Open WhatsApp
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer style={{
          borderTop: "1px solid var(--border)",
          padding: "32px 20px",
          textAlign: "center",
        }}>
          <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: "0.15em", color: "white", marginBottom: 8 }}>
            ERTLONG
          </div>
          <div style={{ fontSize: 11, color: "#444", letterSpacing: "0.1em" }}>
            © 2026 ERTLONG. Premium Streetwear. Worldwide Shipping.
          </div>
        </footer>
      </main>
    </CartProvider>
  );
}
