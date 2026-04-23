import { useEffect } from "react";
import { ordersApi } from "../api/orders";
import { OrdersTable } from "../components/orders/OrdersTable";
import { useAuthStore } from "../store/authStore";
import { useOrdersStore, type OrderStatus } from "../store/ordersStore";

export function OrdersPage() {
  const { orders, total, isLoading, setOrders, setLoading, updateOrderStatus } =
    useOrdersStore();
  const { accessToken } = useAuthStore();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await ordersApi.list(20);
      setOrders(res.data.orders, res.data.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    if (!accessToken) return;
    const sse = new EventSource(`http://localhost:8000/api/events`);

    sse.addEventListener("order.status.updated", (e) => {
      const update = JSON.parse(e.data);
      updateOrderStatus(
        update.orderId,
        update.status as OrderStatus,
        update.courier,
        update.updatedAt,
      );
    });

    return () => sse.close();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-400">
        Loading...
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">My orders</h2>
      <OrdersTable orders={orders} total={total} onRefresh={fetchOrders} />
    </div>
  );
}
