import { X } from "lucide-react";

interface FiltersPanelProps {
  categories: string[];
  category: string;
  minPrice: string;
  maxPrice: string;
  onlyInStock: boolean;
  hasFilters: boolean;
  onFilterChange: (
    cat: string,
    min: string,
    max: string,
    stock: boolean,
  ) => void;
  onClearFilters: () => void;
}

export function FiltersPanel({
  categories,
  category,
  minPrice,
  maxPrice,
  onlyInStock,
  hasFilters,
  onFilterChange,
  onClearFilters,
}: FiltersPanelProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900"
            value={category}
            onChange={(e) =>
              onFilterChange(e.target.value, minPrice, maxPrice, onlyInStock)
            }
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Min price ($)
          </label>
          <input
            type="number"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900"
            placeholder="0"
            value={minPrice}
            onChange={(e) =>
              onFilterChange(category, e.target.value, maxPrice, onlyInStock)
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max price ($)
          </label>
          <input
            type="number"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900"
            placeholder="99999"
            value={maxPrice}
            onChange={(e) =>
              onFilterChange(category, minPrice, e.target.value, onlyInStock)
            }
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={onlyInStock}
            onChange={(e) =>
              onFilterChange(category, minPrice, maxPrice, e.target.checked)
            }
            className="w-4 h-4 rounded border-gray-300"
          />
          <span className="text-sm font-medium text-gray-700">
            Only in stock
          </span>
        </label>

        {hasFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
          >
            <X size={12} />
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
