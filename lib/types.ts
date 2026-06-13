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
  deliveryCost: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type DeliveryMethod = "pickup" | "delivery";
export type PaymentMethod = "bank_transfer" | "card";
export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "awaiting_payment" | "paid";

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  deliveryCost: number;
  total: number;
  status: OrderStatus;
  customerEmail: string;
  customerName: string;
  address: string;
  city: string;
  phone: string;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  proofOfPayment?: string; // base64 image
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
