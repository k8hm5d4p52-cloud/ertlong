"use client";

import { useState, useEffect, FormEvent, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import { supabase, DbProduct } from "@/lib/supabase";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getSession(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("ertlong_admin") === "true";
}

function clearSession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("ertlong_admin");
    localStorage.removeItem("ertlong_admin_email");
  }
}

// Normalise DB row → Product shape used by the rest of the app
function toProduct(row: DbProduct) {
  return {
    id: row.id,
    name: row.name,
    price: Number(row.price),
    description: row.description || "",
    images: row.images || [],
    sizes: row.sizes || [],
    colors: row.colors || [],
    category: row.active ? ("in-stock" as const) : ("discontinued" as const),
    stock: 0,
  };
}

// ─── Modal state ─────────────────────────────────────────────────────────────

type ModalMode = "add" | "edit";

interface FormData {
  name: string;
  price: string;
  description: string;
  images: string;
  sizes: string;
  colors: string;
  active: boolean;
}

function blankForm(): FormData {
  return { name: "", price: "", description: "", images: "", sizes: "", colors: "", active: true };
}

// ─── Toast ───────────────────────────────────────────────────────────────────

interface Toast { message: string; type: "success" | "error" }

function ToastBanner({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3000);
    return () => clearTimeout(t);
  }, [onDismiss]);
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 9999,
      padding: "12px 20px",
      background: toast.type === "success" ? "#1a3a1a" : "#3a1a1a",
      border: `1px solid ${toast.type === "success" ? "#2daa2d" : "#ff3d00"}80`,
      borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 600,
      maxWidth: 320, boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
    }}>
      {toast.message}
    </div>
  );
}

// ─── Confirm dialog ──────────────────────────────────────────────────────────

function ConfirmDialog({
  title, message, onConfirm, onCancel,
}: { title: string; message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9000,
      background: "rgba(0,0,0,0.7)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }}>
      <div style={{
        background: "#1a1a1a", border: "1px solid #2a2a2a",
        borderRadius: 12, padding: "32px", maxWidth: 380, width: "100%",
      }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: 12 }}>{title}</h3>
        <p style={{ fontSize: 13, color: "#888", marginBottom: 24, lineHeight: 1.6 }}>{message}</p>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={onCancel} style={btnStyle("#333", "#999", "50%")}>Cancel</button>
          <button onClick={onConfirm} style={btnStyle("#ff3d00", "#fff", "50%")}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

// Shared btn style factory
function btnStyle(bg: string, color: string, radius: string = "6px") {
  return {
    flex: 1, padding: "10px 16px", background: bg, border: "none", borderRadius: radius,
    color, fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", cursor: "pointer",
    textTransform: "uppercase" as const,
  };
}

// ─── Product Modal ───────────────────────────────────────────────────────────

function ProductModal({
  mode, initial, onSave, onClose,
}: {
  mode: ModalMode; initial?: DbProduct; onSave: (d: FormData) => void; onClose: () => void;
}) {
  const [form, setForm] = useState<FormData>(() =>
    initial
      ? {
          name: initial.name, price: String(initial.price),
          description: initial.description || "",
          images: (initial.images || []).join("\n"),
          sizes: (initial.sizes || []).join(", "),
          colors: (initial.colors || []).join(", "),
          active: initial.active,
        }
      : blankForm()
  );

  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value }));

  const handleSubmit = (e: FormEvent) => { e.preventDefault(); onSave(form); };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 12px", background: "#111", border: "1px solid #2a2a2a",
    borderRadius: 6, color: "#fff", fontSize: 13, outline: "none", boxSizing: "border-box",
    fontFamily: "inherit",
  };

  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
    color: "#888", marginBottom: 6, textTransform: "uppercase",
  };

  const fieldGap: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 4 };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 8000,
      background: "rgba(0,0,0,0.8)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20, overflowY: "auto",
    }}>
      <div style={{
        background: "#1a1a1a", border: "1px solid #2a2a2a",
        borderRadius: 12, padding: "32px", maxWidth: 560, width: "100%", margin: "20px 0",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 900, letterSpacing: "0.08em", color: "#fff" }}>
            {mode === "add" ? "Add New Product" : "Edit Product"}
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 20 }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={fieldGap}>
              <label style={labelStyle}>Name *</label>
              <input style={inputStyle} value={form.name} onChange={set("name")} placeholder="e.g. Oversized Logo Tee" required />
            </div>
            <div style={fieldGap}>
              <label style={labelStyle}>Price (USD) *</label>
              <input style={inputStyle} type="number" step="0.01" min="0" value={form.price} onChange={set("price")} placeholder="0.00" required />
            </div>
          </div>

          <div style={fieldGap}>
            <label style={labelStyle}>Description</label>
            <textarea style={{ ...inputStyle, resize: "vertical", minHeight: 80 }} value={form.description} onChange={set("description")} placeholder="Product description..." />
          </div>

          <div style={fieldGap}>
            <label style={labelStyle}>Image URLs (one per line)</label>
            <textarea style={{ ...inputStyle, resize: "vertical", minHeight: 72, fontFamily: "monospace", fontSize: 12 }} value={form.images} onChange={set("images")} placeholder={"https://...\nhttps://..."} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={fieldGap}>
              <label style={labelStyle}>Sizes (comma-separated)</label>
              <input style={inputStyle} value={form.sizes} onChange={set("sizes")} placeholder="S, M, L, XL" />
            </div>
            <div style={fieldGap}>
              <label style={labelStyle}>Colors (comma-separated)</label>
              <input style={inputStyle} value={form.colors} onChange={set("colors")} placeholder="Black, White, Grey" />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <input type="checkbox" id="active-check" checked={form.active} onChange={set("active")} style={{ width: 16, height: 16, accentColor: "#ff3d00" }} />
            <label htmlFor="active-check" style={{ ...labelStyle, marginBottom: 0, color: "#ccc", textTransform: "none", letterSpacing: "0.05em", fontSize: 12 }}>
              Active (visible on storefront)
            </label>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button type="button" onClick={onClose} style={btnStyle("#222", "#888")}>Cancel</button>
            <button type="submit" style={{ ...btnStyle("#ff3d00", "#fff"), flex: 2 }}>Save Product</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Product Row ──────────────────────────────────────────────────────────────

function ProductRow({
  product, onEdit, onDelete, onToggle,
}: {
  product: DbProduct;
  onEdit: (p: DbProduct) => void;
  onDelete: (id: string) => void;
  onToggle: (p: DbProduct) => void;
}) {
  const [imgError, setImgError] = useState(false);
  const img = (product.images || [])[0];

  return (
    <tr style={{ borderBottom: "1px solid #1e1e1e" }}>
      {/* Image */}
      <td style={{ padding: "12px 16px", width: 72 }}>
        {img && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img} alt={product.name} style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6, background: "#111" }}
            onError={() => setImgError(true)} />
        ) : (
          <div style={{ width: 48, height: 48, borderRadius: 6, background: "#1a1a1a", border: "1px dashed #333", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#333" }}>📷</div>
        )}
      </td>
      {/* Name */}
      <td style={{ padding: "12px 16px" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{product.name}</div>
        <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>ID: {product.id.slice(0, 8)}…</div>
      </td>
      {/* Price */}
      <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 700, color: "#ff3d00", whiteSpace: "nowrap" }}>
        ${Number(product.price).toFixed(2)}
      </td>
      {/* Sizes */}
      <td style={{ padding: "12px 16px", fontSize: 12, color: "#888" }}>
        {(product.sizes || []).join(", ") || "—"}
      </td>
      {/* Colors */}
      <td style={{ padding: "12px 16px", fontSize: 12, color: "#888" }}>
        {(product.colors || []).join(", ") || "—"}
      </td>
      {/* Status */}
      <td style={{ padding: "12px 16px" }}>
        <button
          onClick={() => onToggle(product)}
          style={{
            padding: "5px 12px",
            borderRadius: 20,
            border: "none",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.1em",
            cursor: "pointer",
            textTransform: "uppercase",
            background: product.active ? "rgba(0,200,83,0.15)" : "rgba(255,61,0,0.15)",
            color: product.active ? "#00c853" : "#ff3d00",
          }}
        >
          {product.active ? "Active" : "Inactive"}
        </button>
      </td>
      {/* Actions */}
      <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => onEdit(product)}
            style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid #2a2a2a", background: "transparent", color: "#888", fontSize: 11, fontWeight: 700, cursor: "pointer", letterSpacing: "0.05em" }}
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(product.id)}
            style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid rgba(255,61,0,0.3)", background: "transparent", color: "#ff3d00", fontSize: 11, fontWeight: 700, cursor: "pointer", letterSpacing: "0.05em" }}
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

// ─── Stats bar ───────────────────────────────────────────────────────────────

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 10, padding: "20px 24px", textAlign: "center" }}>
      <div style={{ fontSize: 28, fontWeight: 900, color: "#ff3d00", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 10, color: "#555", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 6 }}>{label}</div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const router = useRouter();

  const [products, setProducts] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("add");
  const [editingProduct, setEditingProduct] = useState<DbProduct | undefined>();

  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [search, setSearch] = useState("");

  // Auth check
  useEffect(() => {
    if (!getSession()) router.replace("/admin/login");
  }, [router]);

  // Fetch products
  const loadProducts = useCallback(async () => {
    if (!supabase) {
      setFetchError("Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local");
      setLoading(false);
      return;
    }
    setLoading(true);
    setFetchError(null);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      setFetchError(`Failed to load products: ${error.message}`);
    } else {
      setProducts((data as DbProduct[]) || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const showToast = (message: string, type: "success" | "error") => setToast({ message, type });

  // ── Actions ──────────────────────────────────────────────────────────────

  const handleAddNew = () => { setModalMode("add"); setEditingProduct(undefined); setModalOpen(true); };

  const handleEdit = (product: DbProduct) => { setModalMode("edit"); setEditingProduct(product); setModalOpen(true); };

  const handleSave = async (form: FormData) => {
    setSaving(true);
    const images = form.images.split("\n").map((u) => u.trim()).filter(Boolean);
    const sizes = form.sizes.split(",").map((s) => s.trim()).filter(Boolean);
    const colors = form.colors.split(",").map((s) => s.trim()).filter(Boolean);

    const payload = {
      name: form.name,
      price: Number(form.price),
      description: form.description || null,
      images,
      sizes,
      colors,
      active: form.active,
      updated_at: new Date().toISOString(),
    };

    if (!supabase) { showToast("Supabase not configured", "error"); setSaving(false); return; }

    if (modalMode === "add") {
      const { error } = await supabase.from("products").insert([payload]);
      if (error) { showToast(`Error: ${error.message}`, "error"); }
      else { showToast("Product added successfully", "success"); setModalOpen(false); loadProducts(); }
    } else if (editingProduct) {
      const { error } = await supabase.from("products").update(payload).eq("id", editingProduct.id);
      if (error) { showToast(`Error: ${error.message}`, "error"); }
      else { showToast("Product updated successfully", "success"); setModalOpen(false); loadProducts(); }
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget || !supabase) return;
    const { error } = await supabase.from("products").delete().eq("id", deleteTarget);
    if (error) { showToast(`Error: ${error.message}`, "error"); }
    else { showToast("Product deleted", "success"); loadProducts(); }
    setDeleteTarget(null);
  };

  const handleToggle = async (product: DbProduct) => {
    if (!supabase) return;
    const { error } = await supabase
      .from("products")
      .update({ active: !product.active, updated_at: new Date().toISOString() })
      .eq("id", product.id);
    if (error) { showToast(`Error: ${error.message}`, "error"); }
    else { showToast(`Product ${product.active ? "deactivated" : "activated"}`, "success"); loadProducts(); }
  };

  const handleLogout = () => {
    clearSession();
    router.replace("/admin/login");
  };

  // ── Filter ────────────────────────────────────────────────────────────────

  const filtered = products.filter((p) =>
    search === "" || p.name.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = products.filter((p) => p.active).length;
  const inactiveCount = products.filter((p) => !p.active).length;

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <CartProvider>
    <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#fff" }}>
      <Header />

      {/* ── Top bar ── */}
      <div style={{ borderBottom: "1px solid #1e1e1e", padding: "0 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <div>
            <span style={{ fontSize: 11, color: "#555", letterSpacing: "0.15em" }}>ERTLONG / </span>
            <span style={{ fontSize: 11, color: "#ff3d00", letterSpacing: "0.15em", fontWeight: 700 }}>ADMIN</span>
          </div>
          <button
            onClick={handleLogout}
            style={{ background: "transparent", border: "1px solid #2a2a2a", borderRadius: 6, color: "#666", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", cursor: "pointer", padding: "6px 14px", textTransform: "uppercase" }}
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div style={{ padding: "32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          <StatCard label="Total Products" value={products.length} />
          <StatCard label="Active (Visible)" value={activeCount} />
          <StatCard label="Inactive (Hidden)" value={inactiveCount} />
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px 20px", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <button
          onClick={handleAddNew}
          style={{ padding: "10px 20px", background: "#ff3d00", border: "none", borderRadius: 6, color: "#fff", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", cursor: "pointer", textTransform: "uppercase" }}
        >
          + Add Product
        </button>

        <div style={{ flex: 1, minWidth: 200 }}>
          <input
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%", padding: "10px 14px", background: "#111", border: "1px solid #2a2a2a", borderRadius: 6, color: "#fff", fontSize: 13, outline: "none", boxSizing: "border-box" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#444")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#2a2a2a")}
          />
        </div>

        <div style={{ fontSize: 12, color: "#444" }}>
          {filtered.length} of {products.length}
        </div>
      </div>

      {/* ── Table ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px 80px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#444", fontSize: 13, letterSpacing: "0.1em" }}>
            LOADING PRODUCTS...
          </div>
        ) : fetchError ? (
          <div style={{ padding: "32px", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 10, textAlign: "center" }}>
            <div style={{ fontSize: 13, color: "#ff3d00", marginBottom: 12, fontWeight: 700 }}>⚠ CONNECTION ERROR</div>
            <div style={{ fontSize: 12, color: "#888", lineHeight: 1.7, maxWidth: 500, margin: "0 auto 20px" }}>{fetchError}</div>
            <div style={{ fontSize: 11, color: "#555", lineHeight: 1.8 }}>
              <div>1. Copy <code style={{ color: "#aaa", background: "#111", padding: "2px 6px", borderRadius: 4 }}>.env.local.example</code> to <code style={{ color: "#aaa", background: "#111", padding: "2px 6px", borderRadius: 4 }}>.env.local</code></div>
              <div>2. Fill in your <code style={{ color: "#aaa", background: "#111", padding: "2px 6px", borderRadius: 4 }}>NEXT_PUBLIC_SUPABASE_URL</code> and <code style={{ color: "#aaa", background: "#111", padding: "2px 6px", borderRadius: 4 }}>NEXT_PUBLIC_SUPABASE_ANON_KEY</code></div>
              <div>3. Run the SQL from <code style={{ color: "#aaa", background: "#111", padding: "2px 6px", borderRadius: 4 }}>.env.local.example</code> in Supabase SQL Editor</div>
              <div>4. Restart the dev server</div>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#444", fontSize: 13 }}>
            {search ? "No products match your search." : "No products yet. Click \"Add Product\" to get started."}
          </div>
        ) : (
          <div style={{ background: "#1a1a1a", border: "1px solid #1e1e1e", borderRadius: 10, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #1e1e1e" }}>
                  {["", "PRODUCT", "PRICE", "SIZES", "COLORS", "STATUS", "ACTIONS"].map((h) => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#444", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <ProductRow key={p.id} product={p} onEdit={handleEdit} onDelete={(id) => setDeleteTarget(id)} onToggle={handleToggle} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <ProductModal
          mode={modalMode}
          initial={editingProduct}
          onSave={handleSave}
          onClose={() => { if (!saving) setModalOpen(false); }}
        />
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <ConfirmDialog
          title="Delete Product"
          message="This action cannot be undone. The product will be permanently removed."
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Toast */}
      {toast && <ToastBanner toast={toast} onDismiss={() => setToast(null)} />}
    </div>
    </CartProvider>
  );
}
