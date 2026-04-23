import { formatCurrency } from "../../lib/utils";
import { StatCard } from "../ui/StatCard";

interface StatsCardsProps {
  totalOrders: number;
  totalRevenue: number;
  avgOrderAmount: number;
  avgProcessingMs: number;
}

export function StatsCards({
  totalOrders,
  totalRevenue,
  avgOrderAmount,
  avgProcessingMs,
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard icon="📦" label="Total orders" value={totalOrders} />
      <StatCard
        icon="💰"
        label="Total revenue"
        value={formatCurrency(totalRevenue)}
      />
      <StatCard
        icon="🛒"
        label="Average order"
        value={formatCurrency(avgOrderAmount)}
      />
      <StatCard
        icon="⚡"
        label="Payment time"
        value={
          avgProcessingMs > 0 ? `${(avgProcessingMs / 1000).toFixed(1)}s` : "—"
        }
        sub="from creation to payment"
      />
    </div>
  );
}
