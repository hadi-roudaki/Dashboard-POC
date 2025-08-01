import { orders, totalPages, currentPage } from "../signals/orderSignals";

const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

export const fetchOrders = async (
  page = 1,
  limit = 50,
  filters?: {
    regions?: string[];
    status?: string;
    search?: string;
  }
) => {
  try {
    // Build query parameters
    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());

    if (filters?.regions && filters.regions.length > 0) {
      filters.regions.forEach((region) =>
        queryParams.append("regions", region)
      );
    }
    if (filters?.status) {
      queryParams.append("status", filters.status);
    }
    if (filters?.search) {
      queryParams.append("search", filters.search);
    }


    const res = await fetch(`${API_URL}/orders?${queryParams.toString()}`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const resData = await res.json();
    orders.value = resData.data || [];
    totalPages.value = resData.pagination.totalPages || 1;
    currentPage.value = resData.pagination.page || 1;
    return resData;
  } catch (error) {
    console.error("Failed to fetch orders from database:", error);
    throw error;
  }
};

export const fetchOrderById = async (id: string) => {
  try {
    const res = await fetch(`${API_URL}/order/${id}`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch order from database:", error);
    throw error;
  }
};
