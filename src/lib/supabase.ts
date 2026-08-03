// Direct REST API client for Supabase - no extra packages needed
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
export type DbProduct = {
  id: string;
  name: string;
  price: number;
  description: string | null;
  images: string[] | null;
  sizes: string[] | null;
  colors: string[] | null;
  active: boolean;
  created_at: string;
  updated_at: string;
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

  if (!res.ok) { console.error(`Supabase error: ${res.status}`); return []; }
  return res.json();
}

export async function getProducts(): Promise<DbProduct[]> {
  return supabaseFetch<DbProduct>("products", { params: { select: "*", order: "created_at.desc" } });
}

export async function getActiveProducts(): Promise<DbProduct[]> {
  return supabaseFetch<DbProduct>("products", { params: { select: "*", eq: "active", order: "created_at.desc" } });
}

export async function getProduct(id: string): Promise<DbProduct | null> {
  const r = await supabaseFetch<DbProduct>("products", { params: { id: `eq.${id}`, select: "*", limit: "1" } });
  return r[0] || null;
}

export async function addProduct(p: Omit<DbProduct, "id" | "created_at" | "updated_at">): Promise<DbProduct | null> {
  const r = await supabaseFetch<DbProduct>("products", { method: "POST", body: { ...p, updated_at: new Date().toISOString() } });
  return r[0] || null;
}

export async function updateProduct(id: string, u: Partial<Omit<DbProduct, "id" | "created_at">>): Promise<DbProduct | null> {
  const r = await supabaseFetch<DbProduct>("products", { method: "PATCH", body: { ...u, updated_at: new Date().toISOString() }, params: { id: `eq.${id}` } });
  return r[0] || null;
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return false;
  const res = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${id}`, {
    method: "DELETE",
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
  });
  return res.ok;
}
