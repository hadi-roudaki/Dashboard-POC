import { orders, totalPages, currentPage } from "../signals/orderSignals";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchOrders = async (page = 1, limit = 50) => {
  const res = await fetch(`${API_URL}/orders?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch orders");

  const resData = await res.json();
  orders.value = resData.data || [];
  totalPages.value = resData.pagination.totalPages || 1;
  currentPage.value = resData.pagination.page || 1;

  return res.json();
};

export const fetchOrderById = async (id: string) => {
  const res = await fetch(`${API_URL}/order/${id}`);
  if (!res.ok) throw new Error("Failed to fetch order");
  return res.json();
};
