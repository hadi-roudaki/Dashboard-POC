import { orders } from "../signals/orderSignals";
import { useNavigate } from "react-router-dom";

export default function OrderTable() {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto rounded shadow">
      <table className="min-w-full table-auto bg-white text-sm text-left">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-2">Order ID</th>
            <th className="px-4 py-2">Amount</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Region</th>
            <th className="px-4 py-2">Order Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.value.map((order) => (
            <tr
              key={order.orderId}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => navigate(`/orders/${order.orderId}`)}
            >
              <td className="px-4 py-2">{order.orderId}</td>
              <td className="px-4 py-2">${order.amount}</td>
              <td className="px-4 py-2">{order.status}</td>
              <td className="px-4 py-2">{order.region}</td>
              <td className="px-4 py-2">
                {new Date(order.orderDate).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
