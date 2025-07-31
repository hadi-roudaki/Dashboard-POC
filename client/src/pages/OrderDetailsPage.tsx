import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchOrderById } from "../api/orders";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const loadOrder = async () => {
      const data = await fetchOrderById(id!);
      setOrder(data);
    };
    loadOrder();
  }, [id]);

  if (!order) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Order Details</h1>
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify(order, null, 2)}
      </pre>
    </div>
  );
}
