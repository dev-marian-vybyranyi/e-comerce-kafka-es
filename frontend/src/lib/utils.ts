export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString("uk-UA");
}

export const STATUS_CONFIG = {
  PENDING: { label: "Pending", color: "bg-gray-100 text-gray-600" },
  PREPARING: { label: "Preparing", color: "bg-amber-100 text-amber-700" },
  SHIPPED: { label: "Shipped", color: "bg-blue-100 text-blue-700" },
  DELIVERED: { label: "Delivered", color: "bg-green-100 text-green-700" },
  PAYMENT_FAILED: { label: "Payment failed", color: "bg-red-100 text-red-700" },
} as const;
