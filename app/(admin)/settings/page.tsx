"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type BusinessInfo = {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  location: string;
  tagline: string;
  workingHours: string;
};

const emptyForm: Omit<BusinessInfo, "id"> = {
  name: "",
  phone: "",
  whatsapp: "",
  email: "",
  location: "",
  tagline: "",
  workingHours: "",
};

export default function SettingsPage() {
  const [form, setForm] = useState(emptyForm);
  const [recordId, setRecordId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data from Supabase on mount
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("business_info")
        .select("*")
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 = no rows found, that's fine
        setError(error.message);
      } else if (data) {
        setRecordId(data.id);
        setForm({
          name: data.name ?? "",
          phone: data.phone ?? "",
          whatsapp: data.whatsapp ?? "",
          email: data.email ?? "",
          location: data.location ?? "",
          tagline: data.tagline ?? "",
          workingHours: data.working_hours ?? "", // match your DB column name
        });
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const setField = (key: keyof typeof emptyForm, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const payload = {
      name: form.name,
      phone: form.phone,
      whatsapp: form.whatsapp,
      email: form.email,
      location: form.location,
      tagline: form.tagline,
      working_hours: form.workingHours, // match your DB column name
    };

    let error;

    if (recordId) {
      // Update existing row
      ({ error } = await supabase
        .from("business_info")
        .update(payload)
        .eq("id", recordId));
    } else {
      // Insert new row if none exists
      ({ error } = await supabase
        .from("business_info")
        .insert(payload));
    }

    if (error) {
      setError(error.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const fields: { key: keyof typeof emptyForm; label: string }[] = [
    { key: "name", label: "Business Name" },
    { key: "phone", label: "Phone" },
    { key: "whatsapp", label: "WhatsApp" },
    { key: "email", label: "Email" },
    { key: "location", label: "Location" },
    { key: "tagline", label: "Tagline" },
    { key: "workingHours", label: "Working Hours" },
  ];

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">
        Settings
      </h1>

      <div className="bg-card border border-border rounded-xl p-4 sm:p-6 w-full max-w-2xl">
        <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4">
          Business Information
        </h2>

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {fields.map(({ key, label }) => (
                <div
                  key={key}
                  className={
                    key === "tagline" || key === "workingHours"
                      ? "sm:col-span-2"
                      : ""
                  }
                >
                  <label className="text-xs sm:text-sm font-medium text-foreground block mb-1">
                    {label}
                  </label>
                  <input
                    value={form[key]}
                    onChange={(e) => setField(key, e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              ))}
            </div>

            {error && (
              <p className="text-red-500 text-sm">Error: {error}</p>
            )}

            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                className="bg-primary hover:bg-primary-dark active:scale-95 text-primary-foreground font-medium py-2 px-5 sm:px-6 rounded-lg text-sm transition-all"
              >
                Save Changes
              </button>

              {saved && (
                <p className="text-primary text-sm font-medium animate-pulse">
                  ✓ Saved!
                </p>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}