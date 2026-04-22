import { cn } from "../../lib/utils";

type Status =
  | "PENDING"
  | "PREPARING"
  | "SHIPPED"
  | "DELIVERED"
  | "PAYMENT_FAILED";

const STATUS_CONFIG: Record<Status, { label: string; className: string }> = {
  PENDING: { label: "Pending", className: "bg-gray-100 text-gray-700" },
  PREPARING: { label: "Preparing", className: "bg-amber-100 text-amber-700" },
  SHIPPED: { label: "Shipped", className: "bg-blue-100 text-blue-700" },
  DELIVERED: { label: "Delivered", className: "bg-green-100 text-green-700" },
  PAYMENT_FAILED: {
    label: "Payment Failed",
    className: "bg-red-100 text-red-700",
  },
};

export function StatusBadge({ status }: { status: Status }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.PENDING;
  return (
    <span
      className={cn(
        "px-2 py-1 rounded-full text-xs font-medium",
        config.className,
      )}
    >
      {config.label}
    </span>
  );
}
