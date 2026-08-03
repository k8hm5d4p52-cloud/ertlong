// Local storage product store - no external DB needed
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

const STORAGE_KEY = "***";

function delay(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

export const supabase = {
  from: (_table: string) => ({
    select: (_cols = "*") => ({
      order: () => ({
        then: (fn: (result: { data: DbProduct[] | null; error: { message: string } | null }) => void) => {
          try {
            const raw = localStorage.getItem(STORAGE_KEY);
            const products: DbProduct[] = raw ? JSON.parse(raw) : [];
            products.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            fn({ data: products, error: null });
          } catch {
            fn({ data: [], error: { message: "Failed to read from localStorage" } });
          }
        },
      }),
    }),
    insert: (payload: unknown) => ({
      then: (fn: (result: { data: unknown[] | null; error: { message: string } | null }) => void) => {
        delay(200).then(() => {
          try {
            const raw = localStorage.getItem(STORAGE_KEY);
            const products: DbProduct[] = raw ? JSON.parse(raw) : [];
            const newProduct: DbProduct = {
              ...(payload as Record<string, unknown>),
              id: crypto.randomUUID(),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };
            products.unshift(newProduct);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
            fn({ data: [newProduct], error: null });
          } catch {
            fn({ data: null, error: { message: "Failed to save" } });
          }
        });
      },
    }),
    update: (payload: Record<string, unknown>) => ({
      eq: (_key: string, id: string) => ({
        then: (fn: (result: { data: unknown[] | null; error: { message: string } | null }) => void) => {
          delay(200).then(() => {
            try {
              const raw = localStorage.getItem(STORAGE_KEY);
              const products: DbProduct[] = raw ? JSON.parse(raw) : [];
              const idx = products.findIndex((p) => p.id === id);
              if (idx !== -1) {
                products[idx] = { ...products[idx], ...payload, updated_at: new Date().toISOString() };
                localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
                fn({ data: [products[idx]], error: null });
              } else {
                fn({ data: null, error: { message: "Product not found" } });
              }
            } catch {
              fn({ data: null, error: { message: "Failed to update" } });
            }
          });
        },
      }),
    }),
    delete: () => ({
      eq: (_key: string, id: string) => ({
        then: (fn: (result: { data: unknown[] | null; error: { message: string } | null }) => void) => {
          delay(200).then(() => {
            try {
              const raw = localStorage.getItem(STORAGE_KEY);
              const products: DbProduct[] = raw ? JSON.parse(raw) : [];
              const filtered = products.filter((p) => p.id !== id);
              localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
              fn({ data: [], error: null });
            } catch {
              fn({ data: null, error: { message: "Failed to delete" } });
            }
          });
        },
      }),
    }),
  }),
};
