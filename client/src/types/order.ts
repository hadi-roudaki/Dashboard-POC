// Define TypeScript interfaces
interface OrderItem {
  productId: string;
  name: string;
  category: string;
  quantity: number;
  unitPrice: number;
  imageUrl?: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  isTrade: boolean;
}

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  orderId: string;
  region: "APAC" | "UK" | "US";
  amount: number;
  currency: "AUD" | "GBP" | "USD";
  items: OrderItem[];
  customer: Customer;
  orderDate: Date;
  deliveryDate?: Date;
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  paymentMethod: string;
  shippingAddress: ShippingAddress;
  metadata?: Record<string, unknown>;
}

interface ApiResponse {
  data: Order[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  summary: Record<
    string,
    {
      totalOrders: number;
      totalRevenue: number;
      avgOrderValue: number;
      topCategories: string[];
    }
  >;
}
