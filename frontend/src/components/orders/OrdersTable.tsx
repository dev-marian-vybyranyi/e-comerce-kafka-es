import type { Order } from "../../store/ordersStore";
import { OrderRow } from "./OrderRow";

interface OrdersTableProps {
  orders: Order[];
  onRefresh: () => void;
  total: number;
}

export function OrdersTable({ orders, onRefresh, total }: OrdersTableProps) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-5xl mb-4">📦</p>
        <p className="font-medium">No orders yet</p>
        <p className="text-sm mt-1">
          Go to the store and make your first order!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <span className="text-sm text-gray-500">
          Total: <strong className="text-gray-900">{total}</strong>
        </span>
        <button
          onClick={onRefresh}
          className="text-xs text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors"
        >
          Refresh
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-500 uppercase font-medium">
              <th className="text-left px-4 py-3">Order ID</th>
              <th className="text-left px-4 py-3">Products</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Total Amount</th>
              <th className="text-left px-4 py-3">Courier</th>
              <th className="text-left px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map((order) => (
              <OrderRow key={order.orderId} order={order} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
