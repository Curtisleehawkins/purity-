"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { User } from "@/lib/types";
import { mockUsers } from "@/lib/mockData";
import DataTable, { Column } from "@/components/layout/DataTable";

const emptyUser: Omit<User, "id"> = {
  name: "",
  email: "",
  password: "",
  role: "Admin",
  status: "active",
  joinedAt: new Date().toISOString().slice(0, 10),
};

const columns: Column<User>[] = [
  {
    key: "name",
    header: "Name",
    cell: (u) => (
      <div>
        <span className="font-medium text-foreground block">{u.name}</span>
        {/* Email + role shown under name on mobile only */}
        <span className="text-xs text-muted-foreground sm:hidden">{u.email}</span>
        <span className="text-xs text-muted-foreground block md:hidden sm:hidden">{u.role}</span>
      </div>
    ),
  },
  {
    key: "email",
    header: "Email",
    hideOnMobile: true,
    cell: (u) => <span className="text-muted-foreground">{u.email}</span>,
  },
  {
    key: "role",
    header: "Role",
    hideOnTablet: true,
    cell: (u) => <span className="text-muted-foreground">{u.role}</span>,
  },
  {
    key: "status",
    header: "Status",
    cell: (u) => (
      <span
        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
          u.status === "active"
            ? "bg-primary/10 text-primary"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {u.status}
      </span>
    ),
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState<Omit<User, "id">>(emptyUser);
  const [showForm, setShowForm] = useState(false);

  const openAdd = () => { setEditing(null); setForm(emptyUser); setShowForm(true); };
  const openEdit = (user: User) => { setEditing(user); setForm(user); setShowForm(true); };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editing) {
      setUsers((prev) => prev.map((u) => u.id === editing.id ? { ...editing, ...form } : u));
    } else {
      setUsers((prev) => [...prev, { id: Date.now().toString(), ...form }]);
    }
    setShowForm(false);
  };

  const handleDelete = (user: User) =>
    setUsers((prev) => prev.filter((u) => u.id !== user.id));

  const setField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Users</h1>
        <button
          onClick={openAdd}
          className="bg-primary hover:bg-primary-dark text-primary-foreground text-sm font-medium px-3 sm:px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add User</span>
        </button>
      </div>

      {/* Universal DataTable */}
      <DataTable<User>
        data={users}
        columns={columns}
        keyExtractor={(u) => u.id}
        onEdit={openEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search users..."
        searchKeys={["name", "email", "role"]}
        pageSize={10}
      />

      {/* Bottom sheet on mobile, centered modal on sm+ */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-card w-full sm:max-w-md rounded-t-2xl sm:rounded-xl p-5 sm:p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="w-10 h-1 bg-muted rounded-full mx-auto mb-4 sm:hidden" />

            <h2 className="text-lg font-semibold text-foreground mb-4">
              {editing ? "Edit User" : "Add User"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                placeholder="Name"
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                autoCapitalize="none"
                autoCorrect="off"
                required
              />
              <select
                value={form.role}
                onChange={(e) => setField("role", e.target.value as User["role"])}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option>Super Admin</option>
                <option>Manager</option>
                <option>Editor</option>
              </select>
              <select
                value={form.status}
                onChange={(e) => setField("status", e.target.value as User["status"])}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark text-primary-foreground font-medium py-2.5 rounded-lg text-sm transition-colors mt-1"
              >
                {editing ? "Update User" : "Add User"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}