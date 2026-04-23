import { formatCurrency, formatDate } from "../../lib/utils";
import type { Order } from "../../store/ordersStore";
import { StatusBadge } from "../ui/StatusBadge";

interface SearchResultsProps {
  results: Order[];
  total: number;
  page: number;
  loading: boolean;
  onPageChange: (p: number) => void;
}

export function SearchResults({
  results,
  total,
  page,
  loading,
  onPageChange,
}: SearchResultsProps) {
  const pages = Math.ceil(total / 10);

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-sm text-gray-400">
        Searching...
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p className="text-4xl mb-3">🔍</p>
        <p className="text-gray-500 font-medium">No results found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-2.5 border-b border-gray-100 text-xs text-gray-400">
        Found: <strong className="text-gray-700">{total}</strong>
      </div>

      <div className="divide-y divide-gray-50">
        {results.map((order) => (
          <div
            key={order.orderId}
            className="px-4 py-3 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-xs text-gray-400">
                {order.orderId.slice(0, 20)}...
              </span>
              <StatusBadge status={order.status} />
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
              <span>👤 {order.userId}</span>
              <span className="font-semibold text-gray-800">
                {formatCurrency(order.totalAmount)}
              </span>
              {order.courier && <span>🚚 {order.courier}</span>}
              <span>{formatDate(order.createdAt)}</span>
            </div>
            <div className="flex gap-1 mt-1.5 flex-wrap">
              {order.items?.map((item, i) => (
                <span
                  key={i}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                >
                  {item.productId} ×{item.quantity}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 p-3 border-t border-gray-100">
          <button
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
            className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
          >
            ← Previous
          </button>
          <span className="text-xs text-gray-500">
            {page} / {pages}
          </span>
          <button
            disabled={page === pages}
            onClick={() => onPageChange(page + 1)}
            className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
