import type { OrderStatus } from "../../store/ordersStore";

const CONFIG: Record<OrderStatus, { label: string; color: string }> = {
  PENDING: { label: "Pending", color: "bg-gray-100 text-gray-600" },
  PREPARING: { label: "Preparing", color: "bg-amber-100 text-amber-700" },
  SHIPPED: { label: "Shipped", color: "bg-blue-100 text-blue-700" },
  DELIVERED: { label: "Delivered", color: "bg-green-100 text-green-700" },
  PAYMENT_FAILED: { label: "Payment failed", color: "bg-red-100 text-red-700" },
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = CONFIG[status] ?? CONFIG.PENDING;
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}
    >
      {cfg.label}
    </span>
  );
}
