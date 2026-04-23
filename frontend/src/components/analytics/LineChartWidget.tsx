import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Point {
  time: string;
  orders: number;
}

export function LineChartWidget({ data }: { data: Point[] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Orders / min</h3>
      {data.length > 1 ? (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data}>
            <XAxis dataKey="time" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="orders"
              stroke="#111827"
              strokeWidth={2}
              dot={false}
              name="Orders"
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-48 flex items-center justify-center text-sm text-gray-400">
          Waiting for data...
        </div>
      )}
    </div>
  );
}
