import { useEffect, useRef, useState } from "react";
import { searchApi } from "../api/search";
import { SearchBar } from "../components/search/SearchBar";
import { SearchResults } from "../components/search/SearchResults";
import { type Order } from "../store/ordersStore";

export function SearchPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [results, setResults] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const debounce = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const doSearch = async (q: string, s: string, p: number) => {
    setLoading(true);
    try {
      const res = await searchApi.search({
        q,
        status: s || undefined,
        page: p,
        limit: 10,
      });
      setResults(res.data.results);
      setTotal(res.data.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    clearTimeout(debounce.current);
    debounce.current = setTimeout(() => {
      setPage(1);
      doSearch(query, status, 1);
    }, 300);
  }, [query, status]);

  const handlePageChange = (p: number) => {
    setPage(p);
    doSearch(query, status, p);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Search orders</h2>
      <SearchBar
        query={query}
        status={status}
        onQueryChange={setQuery}
        onStatusChange={setStatus}
      />
      <SearchResults
        results={results}
        total={total}
        page={page}
        loading={loading}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
