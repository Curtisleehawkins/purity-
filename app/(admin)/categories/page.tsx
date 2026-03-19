"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Category } from "@/lib/types";
import { categories as initialCategories } from "@/lib/mockData";
import DataTable, { Column } from "@/components/layout/DataTable";

const emptyCategory: Omit<Category, "id"> = {
  name: "",
  slug: "",
  icon: "",
  description: "",
  image: "/placeholder.svg",
};

const columns: Column<Category>[] = [
  {
    key: "name",
    header: "Name",
    cell: (c) => (
      <div>
        <span className="font-medium text-foreground">
          {c.icon} {c.name}
        </span>
        {/* Slug shown inline under name on mobile only */}
        <p className="text-xs text-muted-foreground mt-0.5 sm:hidden">{c.slug}</p>
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
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState(emptyCategory);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyCategory);
    setModalOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditing(category);
    setForm(category);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      setCategories((prev) =>
        prev.map((c) => (c.id === editing.id ? { ...form, id: editing.id } : c))
      );
    } else {
      setCategories((prev) => [
        ...prev,
        { ...form, id: Date.now().toString() },
      ]);
    }
    setModalOpen(false);
  };

  const handleDelete = (category: Category) => {
    setCategories((prev) => prev.filter((c) => c.id !== category.id));
  };

  const setField = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      {/* Header */}
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

      {/* Universal DataTable */}
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

      {/* Modal — full screen on mobile, centered card on sm+ */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-card w-full sm:max-w-md rounded-t-2xl sm:rounded-xl p-5 sm:p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground p-1"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Drag handle hint on mobile */}
            <div className="w-10 h-1 bg-muted rounded-full mx-auto mb-4 sm:hidden" />

            <h2 className="text-lg font-semibold mb-4">
              {editing ? "Edit Category" : "Add Category"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              {(["name", "slug", "icon", "description"] as const).map((field) => (
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

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark text-primary-foreground font-medium py-2.5 rounded-lg text-sm transition-colors mt-1"
              >
                {editing ? "Update" : "Add"} Category
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;