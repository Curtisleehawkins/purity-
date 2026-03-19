/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { Plus, X, Upload, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import DataTable, { Column } from "@/components/layout/DataTable";
import ImageCompressor from "@/components/layout/ImageCompressor";

type Category = {
  id: string;
  name: string;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  price: number;
  originalPrice?: number;
  description: string;
  features: string[];
  image: string;
  badge?: string;
  inStock: boolean;
};

const emptyProduct: Omit<Product, "id"> = {
  name: "",
  slug: "",
  categoryId: "",
  price: 0,
  originalPrice: undefined,
  description: "",
  features: [],
  image: "",
  badge: undefined,
  inStock: true,
};

const columns = (getCategoryName: (id: string) => string): Column<Product>[] => [
  {
    key: "image",
    header: "Image",
    hideOnMobile: true,
    cell: (p) =>
      p.image ? (
        <img src={p.image} alt={p.name} className="h-8 w-8 rounded object-cover bg-muted" />
      ) : (
        <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
          <ImageIcon className="w-4 h-4 text-muted-foreground" />
        </div>
      ),
  },
  {
    key: "name",
    header: "Name",
    cell: (p) => (
      <div className="flex items-center gap-2 sm:block">
        {p.image ? (
          <img src={p.image} alt={p.name} className="h-8 w-8 rounded object-cover bg-muted shrink-0 sm:hidden" />
        ) : (
          <div className="h-8 w-8 rounded bg-muted flex items-center justify-center shrink-0 sm:hidden">
            <ImageIcon className="w-4 h-4 text-muted-foreground" />
          </div>
        )}
        <div>
          <span className="font-medium text-foreground block leading-tight">{p.name}</span>
          <span className="text-xs text-muted-foreground lg:hidden">{getCategoryName(p.categoryId)}</span>
        </div>
      </div>
    ),
  },
  {
    key: "categoryId",
    header: "Category",
    hideOnTablet: true,
    cell: (p) => <span className="text-muted-foreground">{getCategoryName(p.categoryId)}</span>,
  },
  {
    key: "price",
    header: "Price",
    cell: (p) => (
      <div>
        <span className="font-semibold text-foreground block">Kes {p.price}</span>
        {p.originalPrice && (
          <span className="text-xs text-muted-foreground line-through md:hidden">
            Kes{p.originalPrice}
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
      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
        p.inStock ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
      }`}>
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
        <span className="bg-secondary/10 text-secondary text-xs px-2 py-0.5 rounded-full">{p.badge}</span>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  },
];

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyProduct);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [featuresInput, setFeaturesInput] = useState("");

  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      const [{ data: productsData, error: pErr }, { data: categoriesData, error: cErr }] =
        await Promise.all([
          supabase.from("products").select("*").order("created_at", { ascending: false }),
          supabase.from("categories").select("id, name").order("name"),
        ]);

      if (pErr) { setError(pErr.message); }
      if (cErr) { setError(cErr.message); }

      // Map snake_case DB columns → camelCase
      setProducts(
        (productsData ?? []).map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          categoryId: p.category_id ?? "",
          price: Number(p.price),
          originalPrice: p.original_price ? Number(p.original_price) : undefined,
          description: p.description ?? "",
          features: p.features ?? [],
          image: p.image ?? "",
          badge: p.badge ?? undefined,
          inStock: p.in_stock,
        }))
      );

      setCategories(categoriesData ?? []);
      setLoading(false);
    };

    fetchData();
  }, []);

  const getCategoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name || "—";

  const openAdd = () => {
    setEditing(null);
    setForm(emptyProduct);
    setImageFile(null);
    setImagePreview("");
    setFeaturesInput("");
    setError(null);
    setModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setForm(product);
    setImageFile(null);
    setImagePreview(product.image ?? "");
    setFeaturesInput(product.features.join(", "));
    setError(null);
    setModalOpen(true);
  };

  // ✅ Called by ImageCompressor after compression
  const handleCompressed = (file: File) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError(null);
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview("");
    setForm((prev) => ({ ...prev, image: "" }));
  };

  // Upload to Supabase Storage
  const uploadImage = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage
      .from("product-images")
      .upload(fileName, file, { upsert: false });

    if (error) throw new Error(error.message);

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      let imageUrl = form.image;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      // Parse features from comma-separated input
      const features = featuresInput
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean);

      // Map camelCase → snake_case for DB
      const payload = {
        name: form.name,
        slug: form.slug,
        category_id: form.categoryId || null,
        price: form.price,
        original_price: form.originalPrice ?? null,
        description: form.description,
        features,
        image: imageUrl,
        badge: form.badge ?? null,
        in_stock: form.inStock,
      };

      if (editing) {
        const { error } = await supabase
          .from("products")
          .update(payload)
          .eq("id", editing.id);

        if (error) throw new Error(error.message);

        setProducts((prev) =>
          prev.map((p) =>
            p.id === editing.id
              ? { ...form, id: editing.id, image: imageUrl, features }
              : p
          )
        );
      } else {
        const { data, error } = await supabase
          .from("products")
          .insert(payload)
          .select()
          .single();

        if (error) throw new Error(error.message);

        setProducts((prev) => [
          {
            id: data.id,
            name: data.name,
            slug: data.slug,
            categoryId: data.category_id ?? "",
            price: Number(data.price),
            originalPrice: data.original_price ? Number(data.original_price) : undefined,
            description: data.description ?? "",
            features: data.features ?? [],
            image: data.image ?? "",
            badge: data.badge ?? undefined,
            inStock: data.in_stock,
          },
          ...prev,
        ]);
      }

      setModalOpen(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product: Product) => {
    const { error } = await supabase.from("products").delete().eq("id", product.id);
    if (error) { setError(error.message); return; }
    setProducts((prev) => prev.filter((p) => p.id !== product.id));
  };

  const setField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div>
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

      {error && <p className="text-red-500 text-sm mb-4">Error: {error}</p>}

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : (
        <DataTable<Product>
          data={products}
          columns={columns(getCategoryName)}
          keyExtractor={(p) => p.id}
          onEdit={openEdit}
          onDelete={handleDelete}
          searchPlaceholder="Search products..."
          searchKeys={["name", "slug", "description"]}
          pageSize={5}
        />
      )}

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

              {/* ✅ Image Upload via ImageCompressor */}
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">
                  Product Image{" "}
                  <span className="text-muted-foreground font-normal">(auto-compressed to ~200KB)</span>
                </label>

                <ImageCompressor onCompress={handleCompressed} maxSizeKB={200}>
                  {(trigger) =>
                    imagePreview ? (
                      <div className="relative w-full h-36 mb-2 rounded-lg overflow-hidden border border-input">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={clearImage}
                          className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={trigger}
                          className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-lg hover:bg-black/70"
                        >
                          Change
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={trigger}
                        className="w-full h-36 border-2 border-dashed border-input rounded-lg flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                      >
                        <Upload className="w-6 h-6" />
                        <span className="text-sm">Click to upload image</span>
                        <span className="text-xs">PNG, JPG, WEBP · Auto-compressed</span>
                      </button>
                    )
                  }
                </ImageCompressor>
              </div>

              {/* Name + Slug */}
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
                  placeholder="slug"
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>

              {/* Category */}
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

              {/* Price + Original Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setField("price", Number(e.target.value))}
                    placeholder="0.00"
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

              {/* Description */}
              <textarea
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
                placeholder="Description"
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />

              {/* Features */}
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  Features <span className="font-normal">(comma-separated)</span>
                </label>
                <input
                  value={featuresInput}
                  onChange={(e) => setFeaturesInput(e.target.value)}
                  placeholder="e.g. Waterproof, Lightweight, USB-C"
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Badge + In Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
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
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-primary hover:bg-primary-dark active:scale-95 text-primary-foreground font-medium py-2.5 rounded-lg text-sm transition-all mt-1 disabled:opacity-60"
              >
                {saving ? "Saving..." : editing ? "Update Product" : "Add Product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;