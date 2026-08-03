// Supabase REST API client - no @supabase/supabase-js needed
const SUPABASE_ANON_KEY = proces…_KEY || "";
const SUPABASE_ANON_KEY = proces…_KEY || "";

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

// Chainable query builder
function queryBuilder(table: string) {
  let url = `${SUPABASE_URL}/rest/v1/${table}`;
  const headers = () => ({
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  });

  return {
    select: (cols = "*") => ({ ...queryBuilder(table), _select: cols, _url: url + `?select=${cols}` }),
    eq: (k: string, v: string) => { url += `&${k}=${v}`; return queryBuilder(table); },
    order: (col: string, o = "desc") => { url += `&order=${col}.${o}`; return queryBuilder(table); },
    then: (fn: (data: unknown) => void) => {
      if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return fn({ data: [], error: { message: "Not configured" } });
      return fetch(url, { headers: headers() }).then(r => r.ok ? r.json().then(d => fn({ data: d, error: null })) : fn({ data: [], error: { message: `HTTP ${r.status}` } }));
    },
    insert: (body: unknown) => {
      return fetch(`${SUPABASE_URL}/rest/v1/${table}`, { method: "POST", headers: headers(), body: JSON.stringify(body) }).then(r => r.json()).then(d => ({ data: d, error: r.ok ? null : { message: d.message } }));
    },
    update: (body: unknown) => {
      return fetch(url, { method: "PATCH", headers: headers(), body: JSON.stringify(body) }).then(r => r.json()).then(d => ({ data: d, error: r.ok ? null : { message: d.message } }));
    },
    delete: () => {
      return fetch(url, { method: "DELETE", headers: headers() }).then(r => r.ok ? r.json() : { error: { message: `HTTP ${r.status}` } }).then(d => ({ data: d, error: null }));
    },
  };
}

export const supabase = {
  from: (table: string) => ({
    select: (cols = "*") => queryBuilder(table).select(cols),
    insert: (body: unknown) => queryBuilder(table).insert([body]),
    update: (body: unknown) => queryBuilder(table).update(body),
    delete: () => queryBuilder(table).delete(),
    then: (fn: (data: unknown) => void) => queryBuilder(table).then(fn),
  }),
  then: (fn: (data: unknown) => void) => fn({ data: null }),
};
