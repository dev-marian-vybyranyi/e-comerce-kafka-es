import { useFormik } from "formik";
import * as Yup from "yup";
import type { Product, ProductPayload } from "../../../api/products";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";

const EMOJIS = [
  "📱",
  "💻",
  "🎧",
  "📟",
  "⌚",
  "🖥️",
  "⌨️",
  "🖱️",
  "📷",
  "🎮",
  "📦",
];

const ProductSchema = Yup.object({
  name: Yup.string().min(1).required("Required"),
  description: Yup.string(),
  price: Yup.number().positive("Must be > 0").required("Required"),
  category: Yup.string().min(1).required("Required"),
  emoji: Yup.string().required("Required"),
  inStock: Yup.boolean().required(),
});

interface ProductFormProps {
  initialData: Product | null;
  onSubmit: (values: ProductPayload) => Promise<void>;
  onCancel: () => void;
  error: string;
}

export function ProductForm({
  initialData,
  onSubmit,
  onCancel,
  error,
}: ProductFormProps) {
  const formik = useFormik<ProductPayload>({
    initialValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      price: initialData?.price ?? 0,
      category: initialData?.category ?? "",
      emoji: initialData?.emoji ?? "📦",
      inStock: initialData?.inStock ?? true,
    },
    enableReinitialize: true,
    validationSchema: ProductSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await onSubmit(values);
        resetForm();
      } catch (e) {
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-5">
        {initialData ? `Edit Product: ${initialData.name}` : "New Product"}
      </h3>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Name"
            {...formik.getFieldProps("name")}
            error={formik.touched.name ? formik.errors.name : undefined}
          />
          <Input
            label="Category"
            {...formik.getFieldProps("category")}
            error={formik.touched.category ? formik.errors.category : undefined}
          />
        </div>

        <Input
          label="Description"
          {...formik.getFieldProps("description")}
          error={
            formik.touched.description ? formik.errors.description : undefined
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Price ($)"
            type="number"
            step="0.01"
            {...formik.getFieldProps("price")}
            error={formik.touched.price ? formik.errors.price : undefined}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Emoji
            </label>
            <div className="flex gap-2 flex-wrap">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => formik.setFieldValue("emoji", e)}
                  className={`text-2xl p-2 rounded-lg border transition-colors
                    ${
                      formik.values.emoji === e
                        ? "border-gray-900 bg-gray-100"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="inStock"
            checked={formik.values.inStock}
            onChange={(e) => formik.setFieldValue("inStock", e.target.checked)}
            className="w-4 h-4 rounded border-gray-300"
          />
          <label
            htmlFor="inStock"
            className="text-sm font-medium text-gray-700"
          >
            In stock
          </label>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={formik.isSubmitting}>
            {initialData ? "Save" : "Create"}
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
