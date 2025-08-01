import { orders } from "../signals/orderSignals";
import { useNavigate } from "react-router-dom";
import { useSignals } from "@preact/signals-react/runtime";
import { useState } from "react";

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

const regionFlags = {
  APAC: '🇦🇺',
  UK: '🇬🇧',
  US: '🇺🇸'
};

type SortField = 'orderId' | 'amount' | 'status' | 'region' | 'orderDate';
type SortDirection = 'asc' | 'desc';

export default function OrderTable() {
  useSignals();
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<SortField>('orderDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const formatCurrency = (amount: number, region: string) => {
    const currencyMap = {
      APAC: { symbol: '$', locale: 'en-AU', currency: 'AUD' },
      UK: { symbol: '£', locale: 'en-GB', currency: 'GBP' },
      US: { symbol: '$', locale: 'en-US', currency: 'USD' }
    };

    const config = currencyMap[region as keyof typeof currencyMap];
    if (!config) return `$${amount}`;

    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <span className="text-gray-400">↕️</span>;
    }
    return sortDirection === 'asc' ? <span className="text-blue-600">↑</span> : <span className="text-blue-600">↓</span>;
  };

  const sortedOrders = [...(orders.value || [])].sort((a, b) => {
    let aValue: any = a[sortField];
    let bValue: any = b[sortField];

    // Handle different data types
    if (sortField === 'orderDate') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    } else if (sortField === 'amount') {
      aValue = Number(aValue);
      bValue = Number(bValue);
    } else if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  if (!sortedOrders || sortedOrders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="text-gray-500 text-lg">No orders found</div>
        <div className="text-gray-400 text-sm mt-2">
          Try adjusting your filters or check back later
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th
                className="text-left py-3 px-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-100 select-none"
                onClick={() => handleSort('orderId')}
              >
                <div className="flex items-center space-x-1">
                  <span>Order ID</span>
                  {getSortIcon('orderId')}
                </div>
              </th>
              <th
                className="text-left py-3 px-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-100 select-none"
                onClick={() => handleSort('region')}
              >
                <div className="flex items-center space-x-1">
                  <span>Region</span>
                  {getSortIcon('region')}
                </div>
              </th>
              <th
                className="text-left py-3 px-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-100 select-none"
                onClick={() => handleSort('amount')}
              >
                <div className="flex items-center space-x-1">
                  <span>Amount</span>
                  {getSortIcon('amount')}
                </div>
              </th>
              <th
                className="text-left py-3 px-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-100 select-none"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  {getSortIcon('status')}
                </div>
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Customer</th>
              <th
                className="text-left py-3 px-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-100 select-none"
                onClick={() => handleSort('orderDate')}
              >
                <div className="flex items-center space-x-1">
                  <span>Order Date</span>
                  {getSortIcon('orderDate')}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sortedOrders.map((order) => (
              <tr
                key={order.orderId}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => navigate(`/orders/${order.orderId}`)}
              >
                <td className="py-3 px-4">
                  <div className="font-medium text-gray-900">{order.orderId}</div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">
                      {regionFlags[order.region as keyof typeof regionFlags]}
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      {order.region}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="font-semibold text-gray-900">
                    {formatCurrency(order.amount, order.region)}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    statusColors[order.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm text-gray-900">{order.customer.name}</div>
                  <div className="text-xs text-gray-500">{order.customer.email}</div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm text-gray-900">
                    {formatDate(order.orderDate)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
