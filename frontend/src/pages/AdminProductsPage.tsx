import { useEffect, useState } from "react";
import {
  productsApi,
  type Product,
  type ProductPayload,
} from "../api/products";
import { ProductForm } from "../components/admin/products/ProductForm";
import { ProductsTable } from "../components/admin/products/ProductsTable";
import { Button } from "../components/ui/Button";

export function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await productsApi.list();
      setProducts(res.data.products);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSave = async (values: ProductPayload) => {
    setError("");
    try {
      if (editing) {
        await productsApi.update(editing.id, values);
      } else {
        await productsApi.create(values);
      }
      await fetchProducts();
      setShowForm(false);
      setEditing(null);
    } catch (e: any) {
      setError(e.response?.data?.error || "Error saving");
      throw e;
    }
  };

  const handleEdit = (product: Product) => {
    setEditing(product);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await productsApi.delete(id);
      await fetchProducts();
    } catch {
      setError("Error deleting");
    } finally {
      setDeleteId(null);
    }
  };

  const handleNew = () => {
    setEditing(null);
    setShowForm(true);
    setError("");
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditing(null);
    setError("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">
          Manage Products
          <span className="ml-2 text-sm font-normal text-gray-400">
            ({products.length})
          </span>
        </h2>
        {!showForm && <Button onClick={handleNew}>+ New Product</Button>}
      </div>

      {showForm && (
        <ProductForm
          initialData={editing}
          onSubmit={handleSave}
          onCancel={handleCancel}
          error={error}
        />
      )}

      <ProductsTable
        products={products}
        loading={loading}
        deleteId={deleteId}
        onEdit={handleEdit}
        onDeleteClick={setDeleteId}
        onDeleteConfirm={handleDelete}
        onDeleteCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
