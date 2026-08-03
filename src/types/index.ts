export interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: "in-stock" | "restocking" | "discontinued";
  sizes: string[];
  colors: string[];
  stock: number;
  description: string;
}

export interface CartItem {
  product: Product;
  size: string;
  color: string;
  quantity: number;
}
