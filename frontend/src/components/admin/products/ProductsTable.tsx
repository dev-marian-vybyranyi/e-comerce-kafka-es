import type { Product } from "../../../api/products";
import { formatCurrency } from "../../../lib/utils";
import { Button } from "../../ui/Button";

interface ProductsTableProps {
  products: Product[];
  loading: boolean;
  deleteId: string | null;
  onEdit: (product: Product) => void;
  onDeleteClick: (id: string) => void;
  onDeleteConfirm: (id: string) => void;
  onDeleteCancel: () => void;
}

export function ProductsTable({
  products,
  loading,
  deleteId,
  onEdit,
  onDeleteClick,
  onDeleteConfirm,
  onDeleteCancel,
}: ProductsTableProps) {
  if (loading) {
    return <div className="text-center py-8 text-gray-400">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-500 uppercase">
            <th className="text-left px-4 py-3">Product</th>
            <th className="text-left px-4 py-3">Category</th>
            <th className="text-left px-4 py-3">Price</th>
            <th className="text-left px-4 py-3">Status</th>
            <th className="text-right px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{product.emoji}</span>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    {product.description && (
                      <p className="text-xs text-gray-400 truncate max-w-xs">
                        {product.description}
                      </p>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {product.category}
                </span>
              </td>
              <td className="px-4 py-3 font-semibold">
                {formatCurrency(product.price)}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium
                  ${
                    product.inStock
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {product.inStock ? "In stock" : "Out of stock"}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                {deleteId === product.id ? (
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-xs text-gray-500">Delete?</span>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => onDeleteConfirm(product.id)}
                    >
                      Yes
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={onDeleteCancel}
                    >
                      No
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => onEdit(product)}
                    >
                      ✏️ Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => onDeleteClick(product.id)}
                    >
                      🗑️ Delete
                    </Button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
