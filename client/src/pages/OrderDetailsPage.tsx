import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchOrderById } from "../api/orders";
import LoadingSpinner from "../components/LoadingSpinner";
import type { Order } from "../types/order";

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  processing: 'bg-purple-100 text-purple-800 border-purple-200',
  shipped: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  delivered: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200'
};

const regionConfig = {
  APAC: { name: 'Asia Pacific', flag: '🇦🇺', currency: 'AUD' },
  UK: { name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP' },
  US: { name: 'United States', flag: '🇺🇸', currency: 'USD' }
};

export default function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        const response = await fetchOrderById(id!);
        setOrder(response.data || response);
      } catch (err) {
        setError("Failed to load order details");
        console.error("Error loading order:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadOrder();
    }
  }, [id]);

  const formatCurrency = (amount: number, currency: string) => {
    const currencySymbols = { AUD: '$', GBP: '£', USD: '$' };
    const symbol = currencySymbols[currency as keyof typeof currencySymbols] || '$';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace(/[A-Z]{3}/, symbol);
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading order details..." />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => navigate('/orders')}
            className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
          >
            ← Back to Orders
          </button>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-red-600 text-lg font-medium">
              {error || "Order not found"}
            </div>
            <button
              onClick={() => navigate('/orders')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Return to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  const region = regionConfig[order.region as keyof typeof regionConfig];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/orders')}
            className="mb-4 flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Orders
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tighter">
                Order Details
              </h1>
              <p className="text-gray-600 font-medium">Order ID: {order.orderId}</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <span className={`px-3 py-1 text-sm font-medium rounded-full border ${
                statusColors[order.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800 border-gray-200'
              }`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Summary Card */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Overview */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 tracking-tighter">Order Overview</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{region.flag}</div>
                  <div>
                    <div className="text-sm text-gray-600">Region</div>
                    <div className="font-medium">{region.name}</div>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Total Amount</div>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(order.amount, order.currency)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Order Date</div>
                  <div className="font-medium">{formatDate(order.orderDate)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Payment Method</div>
                  <div className="font-medium capitalize">
                    {order.paymentMethod.replace('_', ' ')}
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 tracking-tighter">Customer Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Name</div>
                  <div className="font-medium">{order.customer.name}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Email</div>
                  <div className="font-medium">{order.customer.email}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Customer Type</div>
                  <div className="font-medium">
                    {order.customer.isTrade ? 'Trade Customer' : 'Retail Customer'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Customer ID</div>
                  <div className="font-medium text-gray-500">{order.customer.id}</div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 tracking-tighter">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🛋️</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-600">{item.category}</div>
                      <div className="text-sm text-gray-500">Product ID: {item.productId}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">Qty: {item.quantity}</div>
                      <div className="text-sm text-gray-600">
                        {formatCurrency(item.unitPrice, order.currency)} each
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Delivery Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 tracking-tighter">Delivery</h2>
              <div className="space-y-3">
                {order.deliveryDate && (
                  <div>
                    <div className="text-sm text-gray-600">Expected Delivery</div>
                    <div className="font-medium">{formatDate(order.deliveryDate)}</div>
                  </div>
                )}
                <div>
                  <div className="text-sm text-gray-600">Shipping Address</div>
                  <div className="font-medium">
                    <div>{order.shippingAddress.street}</div>
                    <div>
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                    </div>
                    <div>{order.shippingAddress.country}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 tracking-tighter">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  📧 Email Customer
                </button>
                <button className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                  📦 Track Shipment
                </button>
                <button className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
                  📄 Print Invoice
                </button>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 tracking-tighter">Order Timeline</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <div className="font-medium">Order Placed</div>
                    <div className="text-sm text-gray-600">{formatDate(order.orderDate)}</div>
                  </div>
                </div>
                {order.status !== 'pending' && (
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div>
                      <div className="font-medium">Order Confirmed</div>
                      <div className="text-sm text-gray-600">Status updated</div>
                    </div>
                  </div>
                )}
                {order.deliveryDate && (
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                    <div>
                      <div className="font-medium">Expected Delivery</div>
                      <div className="text-sm text-gray-600">{formatDate(order.deliveryDate)}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
