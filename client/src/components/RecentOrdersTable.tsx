import { orders } from "../signals/orderSignals";
import { useNavigate } from "react-router-dom";
import { useSignals } from "@preact/signals-react/runtime";

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

export default function RecentOrdersTable() {
  useSignals();
  const navigate = useNavigate();

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
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!orders.value || orders.value.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No recent orders to display
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-700">Order ID</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Region</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Customer</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.value.slice(0, 10).map((order) => (
            <tr
              key={order.orderId}
              className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
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
      
      {orders.value.length > 10 && (
        <div className="text-center py-4">
          <button
            onClick={() => navigate('/orders')}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            View all {orders.value.length} orders →
          </button>
        </div>
      )}
    </div>
  );
}
