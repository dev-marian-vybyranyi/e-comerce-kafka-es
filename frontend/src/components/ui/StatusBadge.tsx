import { STATUS_CONFIG } from "../../lib/utils";
import type { OrderStatus } from "../../store/ordersStore";

const CONFIG: Record<OrderStatus, { label: string; color: string }> = {
  ...STATUS_CONFIG,
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
