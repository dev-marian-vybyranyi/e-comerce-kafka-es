interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon?: string;
  trend?: "up" | "down" | "neutral";
}

export function StatCard({ label, value, sub, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
      {icon && <div className="text-2xl mb-3">{icon}</div>}
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="text-2xl font-bold mt-1 text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}
