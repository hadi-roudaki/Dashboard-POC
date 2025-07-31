import { createBrowserRouter, RouterProvider } from "react-router-dom";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailPage from "./pages/OrderDetailsPage";

const router = createBrowserRouter([
  { path: "/", element: <OrdersPage /> },
  { path: "/orders/:id", element: <OrderDetailPage /> },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
