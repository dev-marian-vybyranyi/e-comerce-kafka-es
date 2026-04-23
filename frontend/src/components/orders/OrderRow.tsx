import { formatCurrency, formatDate } from "../../lib/utils";
import type { Order } from "../../store/ordersStore";
import { StatusBadge } from "../ui/StatusBadge";

export function OrderRow({ order }: { order: Order }) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">
        <span className="font-mono text-xs text-gray-400">
          {order.orderId.slice(0, 8)}...
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-1">
          {order.items.map((item, i) => (
            <span
              key={i}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
            >
              {item.productId} ×{item.quantity}
            </span>
          ))}
        </div>
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={order.status} />
      </td>
      <td className="px-4 py-3 font-semibold text-gray-900">
        {formatCurrency(order.totalAmount)}
      </td>
      <td className="px-4 py-3 text-gray-500 text-sm">
        {order.courier ?? "—"}
      </td>
      <td className="px-4 py-3 text-gray-400 text-xs">
        {formatDate(order.createdAt)}
      </td>
    </tr>
  );
}
