"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = proces…_KEY || "";

type Product = {
  id: string;
  name: string;
  price: number;
  description: string | null;
  images: string[] | null;
  sizes: string[] | null;
  colors: string[] | null;
  active: boolean;
  created_at: string;
};

async function supabaseFetch<T>(
  table: string,
  options: {
    method?: string;
    body?: Record<string, unknown>;
    params?: Record<string, string>;
  } = {}
): Promise<T[]> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return [];
  const { method = "GET", body, params } = options;
  let url = `${SUPABASE_URL}/rest/v1/${table}`;
  if (params) {
    const sp = new URLSearchParams(params);
    url += `?${sp.toString()}`;
  }
  const res = await fetch(url, {
    method,
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) return [];
  return res.json();
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"list" | "add">("list");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    images: "",
    sizes: "",
    colors: "",
    active: true,
  });

  useEffect(() => {
    const loggedIn = localStorage.getItem("admin_logged_in");
    if (!loggedIn) {
      router.push("/admin/login");
      return;
    }
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);
    const data = await supabaseFetch<Product>("products", {
      params: { select: "*", order: "created_at.desc" },
    });
    setProducts(data);
    setLoading(false);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    const newProduct = {
      name: form.name,
      price: parseFloat(form.price) || 0,
      description: form.description || null,
      images: form.images ? form.images.split(",").map((s) => s.trim()) : [],
      sizes: form.sizes ? form.sizes.split(",").map((s) => s.trim()) : [],
      colors: form.colors ? form.colors.split(",").map((s) => s.trim()) : [],
      active: form.active,
      updated_at: new Date().toISOString(),
    };
    await supabaseFetch("products", { method: "POST", body: newProduct });
    setMsg("✅ 产品添加成功！");
    setForm({ name: "", price: "", description: "", images: "", sizes: "", colors: "", active: true });
    setSaving(false);
    loadProducts();
    setTab("list");
  }

  async function handleDelete(id: string) {
    if (!confirm("确定删除该产品？")) return;
    await supabaseFetch("products", {
      method: "DELETE",
      params: { id: `eq.${id}` },
    });
    loadProducts();
  }

  function handleLogout() {
    localStorage.removeItem("admin_logged_in");
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">ERTlong Admin</h1>
          <p className="text-zinc-400 text-sm">管理后台</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-zinc-400 hover:text-white transition"
        >
          退出登入
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-zinc-800 pb-4">
          <button
            onClick={() => setTab("list")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              tab === "list" ? "bg-white text-black" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            }`}
          >
            产品列表 ({products.length})
          </button>
          <button
            onClick={() => setTab("add")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              tab === "add" ? "bg-white text-black" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            }`}
          >
            添加产品
          </button>
        </div>

        {msg && (
          <div className="mb-4 bg-green-400/10 border border-green-400/20 text-green-400 rounded-lg px-4 py-3 text-sm">
            {msg}
          </div>
        )}

        {/* Product List */}
        {tab === "list" && (
          <>
            {loading ? (
              <div className="text-center text-zinc-500 py-20">加载中...</div>
            ) : products.length === 0 ? (
              <div className="text-center text-zinc-500 py-20">暂无产品，请添加</div>
            ) : (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-zinc-800 text-zinc-400">
                    <tr>
                      <th className="text-left px-4 py-3">产品名称</th>
                      <th className="text-left px-4 py-3">价格</th>
                      <th className="text-left px-4 py-3">尺寸</th>
                      <th className="text-left px-4 py-3">颜色</th>
                      <th className="text-left px-4 py-3">状态</th>
                      <th className="text-right px-4 py-3">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-zinc-800/50">
                        <td className="px-4 py-3 font-medium">{p.name}</td>
                        <td className="px-4 py-3">${p.price.toFixed(2)}</td>
                        <td className="px-4 py-3 text-zinc-400">{p.sizes?.join(", ") || "-"}</td>
                        <td className="px-4 py-3 text-zinc-400">{p.colors?.join(", ") || "-"}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              p.active ? "bg-green-400/10 text-green-400" : "bg-zinc-700 text-zinc-400"
                            }`}
                          >
                            {p.active ? "上架" : "下架"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="text-red-400 hover:text-red-300 transition"
                          >
                            删除
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* Add Product Form */}
        {tab === "add" && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-2xl">
            <h2 className="text-lg font-semibold mb-6">添加新产品</h2>
            <form onSubmit={handleAdd} className="space-y-5">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">产品名称 *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-
