import { signal } from "@preact/signals-react";
import type { Order } from "../types/order";

export const orders = signal<Order[]>([]);
export const isLoading = signal(false);
export const currentPage = signal(1);
export const totalPages = signal(1);
export const selectedOrder = signal(null);

// Dashboard-specific signals
export const dashboardSummary = signal<
  Record<
    string,
    {
      totalOrders: number;
      totalRevenue: number;
      avgOrderValue: number;
      topCategories: string[];
    }
  >
>({});
export const lastUpdated = signal<string>("");
export const isDashboardLoading = signal(false);
