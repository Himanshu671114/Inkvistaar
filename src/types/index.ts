export type ProductCategory = 'keychains' | 'mousepads' | 'magnets' | 'accessories';

export interface ProductVariant {
  name: string;
  options: string[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  price: number;
  salePrice?: number;
  stock: number;
  images: string[];
  description: string;
  features: string[];
  specifications: Record<string, string>;
  variants?: ProductVariant[];
  badge?: string;
  isNew?: boolean;
  isBestseller?: boolean;
  popularity: number; // 1-100 score for sorting
  createdAt: string;
  published: boolean;
  archived?: boolean;
}

export interface CartItem {
  productId: string;
  product: Product;
  selectedVariants?: Record<string, string>;
  quantity: number;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pinCode: string;
  isDefault?: boolean;
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
}

export type OrderStatus = 'Order placed' | 'Processing' | 'Shipped' | 'Out for delivery' | 'Delivered';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  selectedVariantText?: string;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    pinCode: string;
  };
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: 'UPI / QR' | 'Credit/Debit Card' | 'Netbanking' | 'Cash on Delivery';
  paymentStatus: 'Pending' | 'Completed' | 'Cash on Delivery';
  status: OrderStatus;
  trackingNumber: string;
  courier: string;
  estimatedDelivery: string;
}
