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
  slug: string;
  description: string;
  image: string;
};

const emptyCategory: Omit<Category, "id"> = {
  name: "",
  slug: "",
  description: "",
  image: "",
};

const columns: Column<Category>[] = [
  {
    key: "name",
    header: "Name",
    cell: (c) => (
      <div className="flex items-center gap-2">
        {c.image ? (
          <img
            src={c.image}
            alt={c.name}
            className="w-8 h-8 rounded-lg object-cover shrink-0"
          />
        ) : (
          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
            <ImageIcon className="w-4 h-4 text-muted-foreground" />
          </div>
        )}
        <div>
          <span className="font-medium text-foreground block">{c.name}</span>
          <p className="text-xs text-muted-foreground mt-0.5 sm:hidden">{c.slug}</p>
        </div>
      </div>
    ),
  },
  {
    key: "slug",
    header: "Slug",
    hideOnMobile: true,
    cell: (c) => <span className="text-muted-foreground">{c.slug}</span>,
  },
  {
    key: "description",
    header: "Description",
    hideOnTablet: true,
    cell: (c) => (
      <span className="text-muted-foreground line-clamp-1">{c.description}</span>
    ),
  },
];

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState(emptyCategory);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Only these two states needed now (no fileInputRef)
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        setError(error.message);
      } else {
        setCategories(data ?? []);
      }
      setLoading(false);
    };

    fetchCategories();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyCategory);
    setImageFile(null);
    setImagePreview("");
    setError(null);
    setModalOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditing(category);
    setForm(category);
    setImageFile(null);
    setImagePreview(category.image ?? "");
    setError(null);
    setModalOpen(true);
  };

  // ✅ Called by ImageCompressor after compression is done
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

  // ✅ Unchanged — exactly as before
  const uploadImage = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage
      .from("category-images")
      .upload(fileName, file, { upsert: false });

    if (error) throw new Error(error.message);

    const { data } = supabase.storage
      .from("category-images")
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

      const payload = {
        name: form.name,
        slug: form.slug,
        description: form.description,
        image: imageUrl,
      };

      if (editing) {
        const { error } = await supabase
          .from("categories")
          .update(payload)
          .eq("id", editing.id);

        if (error) throw new Error(error.message);

        setCategories((prev) =>
          prev.map((c) =>
            c.id === editing.id ? { ...payload, id: editing.id } : c
          )
        );
      } else {
        const { data, error } = await supabase
          .from("categories")
          .insert(payload)
          .select()
          .single();

        if (error) throw new Error(error.message);

        setCategories((prev) => [...prev, data]);
      }

      setModalOpen(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (category: Category) => {
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", category.id);

    if (error) { setError(error.message); return; }

    setCategories((prev) => prev.filter((c) => c.id !== category.id));
  };

  const setField = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Categories</h1>
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
        <DataTable<Category>
          data={categories}
          columns={columns}
          keyExtractor={(c) => c.id}
          onEdit={openEdit}
          onDelete={handleDelete}
          searchPlaceholder="Search categories..."
          searchKeys={["name", "slug", "description"]}
          pageSize={5}
        />
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-card w-full sm:max-w-md rounded-t-2xl sm:rounded-xl p-5 sm:p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground p-1"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="w-10 h-1 bg-muted rounded-full mx-auto mb-4 sm:hidden" />

            <h2 className="text-lg font-semibold mb-4">
              {editing ? "Edit Category" : "Add Category"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">

              {/* ✅ Image Upload — now uses ImageCompressor */}
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">
                  Category Image{" "}
                  <span className="text-muted-foreground font-normal">
                    (auto-compressed to ~200KB)
                  </span>
                </label>

                <ImageCompressor onCompress={handleCompressed} maxSizeKB={200}>
                  {(trigger) =>
                    imagePreview ? (
                      <div className="relative w-full h-36 mb-2 rounded-lg overflow-hidden border border-input">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
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

              {/* Text fields — unchanged */}
              {(["name", "slug", "description"] as const).map((field) => (
                <div key={field}>
                  <label className="text-sm font-medium text-foreground block mb-1 capitalize">
                    {field}
                  </label>
                  <input
                    value={form[field]}
                    onChange={(e) => setField(field, e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>
              ))}

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-primary hover:bg-primary-dark text-primary-foreground font-medium py-2.5 rounded-lg text-sm transition-colors mt-1 disabled:opacity-60"
              >
                {saving ? "Saving..." : editing ? "Update Category" : "Add Category"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;