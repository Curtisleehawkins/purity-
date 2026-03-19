"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Product } from "@/lib/types";
import { products as initialProducts, categories } from "@/lib/mockData";
import DataTable, { Column } from "@/components/layout/DataTable";

const emptyProduct: Omit<Product, "id"> = {
  name: "",
  slug: "",
  categoryId: "",
  price: 0,
  originalPrice: undefined,
  description: "",
  features: [],
  image: "/placeholder.svg",
  badge: undefined,
  inStock: true,
};

const getCategoryName = (id: string) =>
  categories.find((c) => c.id === id)?.name || id;

const columns: Column<Product>[] = [
  {
    key: "image",
    header: "Image",
    hideOnMobile: true,
    cell: (p) => (
      <img
        src={p.image}
        alt={p.name}
        className="h-8 w-8 rounded object-cover bg-muted"
      />
    ),
  },
  {
    key: "name",
    header: "Name",
    cell: (p) => (
      <div className="flex items-center gap-2 sm:block">
        {/* Thumbnail only on mobile */}
        <img
          src={p.image}
          alt={p.name}
          className="h-8 w-8 rounded object-cover bg-muted shrink-0 sm:hidden"
        />
        <div>
          <span className="font-medium text-foreground block leading-tight">
            {p.name}
          </span>
          {/* Category shown under name on mobile only */}
          <span className="text-xs text-muted-foreground lg:hidden">
            {getCategoryName(p.categoryId)}
          </span>
        </div>
      </div>
    ),
  },
  {
    key: "categoryId",
    header: "Category",
    hideOnTablet: true,
    cell: (p) => (
      <span className="text-muted-foreground">{getCategoryName(p.categoryId)}</span>
    ),
  },
  {
    key: "price",
    header: "Price",
    cell: (p) => (
      <div>
        <span className="font-semibold text-foreground block">
          ${p.price.toFixed(2)}
        </span>
        {p.originalPrice && (
          <span className="text-xs text-muted-foreground line-through md:hidden">
            ${p.originalPrice.toFixed(2)}
          </span>
        )}
      </div>
    ),
  },
  {
    key: "originalPrice",
    header: "Original",
    hideOnMobile: true,
    cell: (p) => (
      <span className="text-muted-foreground line-through">
        {p.originalPrice ? `$${p.originalPrice.toFixed(2)}` : "—"}
      </span>
    ),
  },
  {
    key: "inStock",
    header: "Stock",
    cell: (p) => (
      <span
        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
          p.inStock ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
        }`}
      >
        <span className="sm:hidden">{p.inStock ? "✓" : "✗"}</span>
        <span className="hidden sm:inline">{p.inStock ? "In Stock" : "Out"}</span>
      </span>
    ),
  },
  {
    key: "badge",
    header: "Badge",
    hideOnMobile: true,
    cell: (p) =>
      p.badge ? (
        <span className="bg-secondary/10 text-secondary text-xs px-2 py-0.5 rounded-full">
          {p.badge}
        </span>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  },
];

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyProduct);

  const openAdd = () => { setEditing(null); setForm(emptyProduct); setModalOpen(true); };
  const openEdit = (product: Product) => { setEditing(product); setForm(product); setModalOpen(true); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      setProducts((prev) => prev.map((p) => p.id === editing.id ? { ...form, id: editing.id } : p));
    } else {
      setProducts((prev) => [...prev, { ...form, id: Date.now().toString() }]);
    }
    setModalOpen(false);
  };

  const handleDelete = (product: Product) =>
    setProducts((prev) => prev.filter((p) => p.id !== product.id));

  const setField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Products</h1>

        <button
          onClick={openAdd}
          className="bg-primary hover:bg-primary-dark text-primary-foreground text-sm font-medium px-3 sm:px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors shrink-0 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add</span>
        </button>
      </div>

      {/* Universal DataTable */}
      <DataTable<Product>
        data={products}
        columns={columns}
        keyExtractor={(p) => p.id}
        onEdit={openEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search products..."
        searchKeys={["name", "slug", "description"]}
        pageSize={5}
      />

      {/* Bottom sheet on mobile, centered modal on sm+ */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-card w-full sm:max-w-lg rounded-t-2xl sm:rounded-xl p-5 sm:p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-3 right-3 p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="w-10 h-1 bg-muted rounded-full mx-auto mb-4 sm:hidden" />

            <h2 className="text-lg font-semibold mb-4">
              {editing ? "Edit Product" : "Add Product"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  placeholder="Product Name"
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
                <input
                  value={form.slug}
                  onChange={(e) => setField("slug", e.target.value)}
                  placeholder="Slug"
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>

              <select
                value={form.categoryId}
                onChange={(e) => setField("categoryId", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                required
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setField("price", Number(e.target.value))}
                    placeholder="Price"
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Original Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.originalPrice ?? ""}
                    onChange={(e) =>
                      setField("originalPrice", e.target.value ? Number(e.target.value) : undefined)
                    }
                    placeholder="Optional"
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <input
                value={form.badge ?? ""}
                onChange={(e) => setField("badge", e.target.value || undefined)}
                placeholder="Badge (e.g. New, Sale) — optional"
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />

              <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.inStock}
                  onChange={(e) => setField("inStock", e.target.checked)}
                  className="accent-primary h-4 w-4"
                />
                In Stock
              </label>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark active:scale-95 text-primary-foreground font-medium py-2.5 rounded-lg text-sm transition-all mt-1"
              >
                {editing ? "Update" : "Add"} Product
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;