export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  category: string;
  tags: string[];
  inStock: boolean;
  inventory: number;
  featured: boolean;
  weight?: string;
  servings?: number;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  customerEmail: string;
  customerName: string;
  address: string;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export interface PromoCode {
  code: string;
  discount: number;
  type: "fixed" | "percent";
}

export interface AdminUser {
  email: string;
  password: string;
}
