import { Search } from "lucide-react";
import { Input } from "../ui/Input";

const STATUSES = [
  "PENDING",
  "PREPARING",
  "SHIPPED",
  "DELIVERED",
  "PAYMENT_FAILED",
];

interface SearchBarProps {
  query: string;
  status: string;
  onQueryChange: (q: string) => void;
  onStatusChange: (s: string) => void;
}

export function SearchBar({
  query,
  status,
  onQueryChange,
  onStatusChange,
}: SearchBarProps) {
  return (
    <div className="flex gap-3">
      <Input
        icon={<Search size={14} />}
        placeholder="Search by orderId, userId, product..."
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        className="flex-1"
      />
      <select
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900 bg-white"
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
      >
        <option value="">All statuses</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  );
}
