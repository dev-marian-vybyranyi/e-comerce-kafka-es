import { Search, SlidersHorizontal } from "lucide-react";

interface SearchHeaderProps {
  query: string;
  onQueryChange: (q: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  hasFilters: boolean;
}

export function SearchHeader({
  query,
  onQueryChange,
  showFilters,
  onToggleFilters,
  hasFilters,
}: SearchHeaderProps) {
  return (
    <div className="flex gap-3">
      <div className="flex-1 relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          placeholder="Search by name, category..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
      </div>
      <button
        onClick={onToggleFilters}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors
          ${
            showFilters || hasFilters
              ? "bg-gray-900 text-white border-gray-900"
              : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
          }`}
      >
        <SlidersHorizontal size={16} />
        Filters
        {hasFilters && (
          <span className="bg-white text-gray-900 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            !
          </span>
        )}
      </button>
    </div>
  );
}
