import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";

interface PieChartWidgetProps {
  successRate: number;
}

export function PieChartWidget({ successRate }: PieChartWidgetProps) {
  const data = [
    { name: "Successful", value: Math.round(successRate * 100) },
    { name: "Failed", value: Math.round((1 - successRate) * 100) },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        Payment Success Rate
      </h3>
      {data[0].value > 0 ? (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}%`}
            >
              <Cell fill="#22c55e" />
              <Cell fill="#ef4444" />
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-48 flex items-center justify-center text-sm text-gray-400">
          Waiting for data...
        </div>
      )}
    </div>
  );
}
