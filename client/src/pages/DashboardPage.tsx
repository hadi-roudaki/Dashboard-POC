import { useEffect } from "react";
import {
  dashboardSummary,
  isDashboardLoading,
  lastUpdated,
} from "../signals/orderSignals";
import { fetchOrders } from "../api/orders";
import LoadingSpinner from "../components/LoadingSpinner";
import RegionalSummaryCard from "../components/RegionalSummaryCard";
import RecentOrdersTable from "../components/RecentOrdersTable";
import { useSignals } from "@preact/signals-react/runtime";

export default function DashboardPage() {
  useSignals();

  useEffect(() => {
    const loadDashboardData = async () => {
      isDashboardLoading.value = true;
      try {
        // Fetch recent orders with summary data
        const res = await fetchOrders(1, 20); // Get first 20 orders for recent orders display

        if (res.summary) {
          dashboardSummary.value = res.summary;
        }

        if (res.lastUpdated) {
          lastUpdated.value = res.lastUpdated;
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        isDashboardLoading.value = false;
      }
    };

    // Initial load
    loadDashboardData();

    // Auto-refresh every 30 seconds for office display
    const interval = setInterval(() => {
      loadDashboardData();
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  if (isDashboardLoading.value) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const regions = ["APAC", "UK", "US"];
  const summary = dashboardSummary.value;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tighter">
              King Living Orders Dashboard
            </h1>
            <p className="text-lg text-gray-600 font-medium">
              Real-time view across APAC, UK, and US commerce instances
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end space-x-2 text-sm text-gray-500 mb-1">
              <span>Last Updated</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div className="text-lg font-medium text-gray-900">
              {lastUpdated.value
                ? new Date(lastUpdated.value).toLocaleString()
                : "Loading..."}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Auto-refreshes every 30 seconds
            </div>
          </div>
        </div>
      </div>

      {/* Regional Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {regions.map((region) => (
          <RegionalSummaryCard
            key={region}
            region={region}
            data={
              summary[region] || {
                totalOrders: 0,
                totalRevenue: 0,
                avgOrderValue: 0,
                topCategories: [],
              }
            }
          />
        ))}
      </div>

      {/* Overall Statistics */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 tracking-tighter">
          Overall Performance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {Object.values(summary)
                .reduce((acc, curr) => acc + (curr?.totalOrders || 0), 0)
                .toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Orders</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              $
              {Object.values(summary)
                .reduce((acc, curr) => acc + (curr?.totalRevenue || 0), 0)
                .toFixed(2)}
              M
            </div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              $
              {(
                Object.values(summary).reduce(
                  (acc, curr, _index, _arr) => acc + (curr?.avgOrderValue || 0),
                  0
                ) /
                  Object.values(summary).filter((s) => s?.avgOrderValue)
                    .length || 1
              ).toFixed(0)}
              K
            </div>
            <div className="text-sm text-gray-600">Avg Order Value</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">3</div>
            <div className="text-sm text-gray-600">Active Regions</div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tighter">
            Recent Orders
          </h2>
          <a
            href="/orders"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View All Orders →
          </a>
        </div>
        <RecentOrdersTable />
      </div>
    </div>
  );
}
