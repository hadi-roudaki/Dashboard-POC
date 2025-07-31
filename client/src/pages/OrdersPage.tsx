import { useEffect } from "react";
import {
  orders,
  isLoading,
  currentPage,
  totalPages,
} from "../signals/orderSignals";
import OrderTable from "../components/OrderTable";
import PaginationControls from "../components/PaginationControls";
import { fetchOrders } from "../api/orders";
import LoadingSpinner from "../components/LoadingSpinner";
import { effect } from "@preact/signals-react";

export default function OrdersPage() {
  useEffect(() => {
    const stopEffect = effect(() => {
      const loadOrders = async () => {
        isLoading.value = true;
        try {
          //   const res = await fetchOrders(currentPage.value);
          //   orders.value = res.data || [];
          //   totalPages.value = res.pagination.totalPages || 1;
          //   currentPage.value = res.pagination.page || 1;
        } finally {
          isLoading.value = false;
        }
      };

      loadOrders();
    });

    return () => {
      stopEffect(); // cleanup
    };
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      {isLoading.value ? (
        <LoadingSpinner />
      ) : (
        <>
          <OrderTable />
          <PaginationControls />
        </>
      )}
    </div>
  );
}
