import { useEffect, useRef, useState } from "react";
import { productsApi, type Product } from "../api/products";
import { CartSidebar } from "../components/cart/CartSidebar";
import { FiltersPanel } from "../components/product-search/FiltersPanel";
import { ProductGrid } from "../components/product-search/ProductGrid";
import { SearchHeader } from "../components/product-search/SearchHeader";

export function ProductSearchPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const debounce = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    productsApi
      .categories()
      .then((res) => setCategories(res.data.categories))
      .catch(console.error);
    doSearch("", "", "", "", false);
  }, []);

  const doSearch = async (
    q: string,
    cat: string,
    min: string,
    max: string,
    stock: boolean,
  ) => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = {};
      if (q) params.q = q;
      if (cat) params.category = cat;
      if (min) params.minPrice = parseFloat(min);
      if (max) params.maxPrice = parseFloat(max);
      if (stock) params.inStock = true;

      const res = await productsApi.list(params as any);
      setProducts(res.data.products);
      setTotal(res.data.total);
    } finally {
      setLoading(false);
    }
  };

  const handleQueryChange = (q: string) => {
    setQuery(q);
    clearTimeout(debounce.current);
    debounce.current = setTimeout(() => {
      doSearch(q, category, minPrice, maxPrice, onlyInStock);
    }, 300);
  };

  const handleFilterChange = (
    cat: string,
    min: string,
    max: string,
    stock: boolean,
  ) => {
    setCategory(cat);
    setMinPrice(min);
    setMaxPrice(max);
    setOnlyInStock(stock);
    doSearch(query, cat, min, max, stock);
  };

  const clearFilters = () => {
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setOnlyInStock(false);
    doSearch(query, "", "", "", false);
  };

  const hasFilters = Boolean(category || minPrice || maxPrice || onlyInStock);

  return (
    <>
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Пошук товарів</h2>

        <SearchHeader
          query={query}
          onQueryChange={handleQueryChange}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          hasFilters={hasFilters}
        />

        {showFilters && (
          <FiltersPanel
            categories={categories}
            category={category}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onlyInStock={onlyInStock}
            hasFilters={hasFilters}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
          />
        )}

        <ProductGrid products={products} loading={loading} total={total} />
      </div>

      <CartSidebar />
    </>
  );
}
