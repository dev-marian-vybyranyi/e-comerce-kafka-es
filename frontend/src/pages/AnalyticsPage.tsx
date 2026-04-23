import { useEffect, useState } from "react";
import { analyticsApi } from "../api/analytics";
import { searchApi } from "../api/search";
import { LineChartWidget } from "../components/analytics/LineChartWidget";
import { PieChartWidget } from "../components/analytics/PieChartWidget";
import { StatsCards } from "../components/analytics/StatsCards";

interface Point {
  time: string;
  orders: number;
}

export function AnalyticsPage() {
  const [history, setHistory] = useState<Point[]>([]);
  const [successRate, setSuccessRate] = useState(0);
  const [avgMs, setAvgMs] = useState(0);
  const [totals, setTotals] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    avgOrderAmount: 0,
  });

  const fetch = async () => {
    try {
      const [analytics, search] = await Promise.all([
        analyticsApi.stats(),
        searchApi.stats(),
      ]);
      setSuccessRate(analytics.data.successRate);
      setAvgMs(analytics.data.avgProcessingMs);
      setTotals(search.data);
      setHistory((prev) => [
        ...prev.slice(-20),
        {
          time: new Date().toLocaleTimeString("uk-UA"),
          orders: analytics.data.ordersCount,
        },
      ]);
    } catch {}
  };

  useEffect(() => {
    fetch();
    const id = setInterval(fetch, 10_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Analytics</h2>
      <StatsCards
        totalOrders={totals.totalOrders}
        totalRevenue={totals.totalRevenue}
        avgOrderAmount={totals.avgOrderAmount}
        avgProcessingMs={avgMs}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LineChartWidget data={history} />
        <PieChartWidget successRate={successRate} />
      </div>
    </div>
  );
}
