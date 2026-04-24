import { useEffect } from "react";
import { analyticsApi } from "../api/analytics";
import { searchApi } from "../api/search";
import { useAnalyticsStore } from "../store/analyticsStore";
import { StatsCards } from "../components/analytics/StatsCards";
import { LineChartWidget } from "../components/analytics/LineChartWidget";
import { PieChartWidget } from "../components/analytics/PieChartWidget";

export function AnalyticsPage() {
  const { history, successRate, avgMs, totals, addPoint, setStats, setTotals } =
    useAnalyticsStore();

  const fetch = async () => {
    try {
      const [analytics, search] = await Promise.all([
        analyticsApi.stats(),
        searchApi.stats(),
      ]);
      setStats(analytics.data.successRate, analytics.data.avgProcessingMs);
      setTotals(search.data);
      addPoint({
        time: new Date().toLocaleTimeString("uk-UA"),
        orders: analytics.data.ordersCount,
      });
    } catch {}
  };

  useEffect(() => {
    fetch();
    const id = setInterval(fetch, 10_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Аналітика</h2>
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
