import { useEffect, useState } from "react";
import {
  orders,
  isLoading,
  currentPage,
  totalPages,
  dashboardSummary,
} from "../signals/orderSignals";
import OrderTable from "../components/OrderTable";
import PaginationControls from "../components/PaginationControls";
import { fetchOrders } from "../api/orders";
import LoadingSpinner from "../components/LoadingSpinner";
import { useSignals } from "@preact/signals-react/runtime";

export default function OrdersPage() {
  useSignals();

  const [filters, setFilters] = useState({
    regions: ["APAC", "UK", "US"],
    status: "",
    search: "",
  });

  const loadOrders = async () => {
    isLoading.value = true;
    try {
      const res = await fetchOrders(currentPage.value, 50, filters);
      orders.value = res.data || [];
      totalPages.value = res.pagination.totalPages || 1;

      if (res.summary) {
        dashboardSummary.value = res.summary;
      }
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      isLoading.value = false;
    }
  };

  // Load orders when filters change
  useEffect(() => {
    currentPage.value = 1; // Reset to first page when filters change
    loadOrders();
  }, [filters]);

  // Load orders when page changes
  useEffect(() => {
    loadOrders();
  }, [currentPage.value]);

  const handleRegionToggle = (region: string) => {
    setFilters((prev) => ({
      ...prev,
      regions: prev.regions.includes(region)
        ? prev.regions.filter((r) => r !== region)
        : [...prev.regions, region],
    }));
  };

  const handleStatusChange = (status: string) => {
    setFilters((prev) => ({ ...prev, status }));
  };

  const handleSearchChange = (search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tighter">
            All Orders
          </h1>
          <p className="text-gray-600 font-medium">
            Detailed view of orders from all commerce instances
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Region Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Regions
              </label>
              <div className="space-y-2">
                {["APAC", "UK", "US"].map((region) => (
                  <label key={region} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.regions.includes(region)}
                      onChange={() => handleRegionToggle(region)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{region}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Order ID, customer name..."
                value={filters.search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Results Count */}
            <div className="flex items-end">
              <div className="text-sm text-gray-600">
                {orders.value ? (
                  <span>Showing {orders.value.length} orders</span>
                ) : (
                  <span>Loading...</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {isLoading.value ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <OrderTable />
            <div className="mt-6">
              <PaginationControls />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
