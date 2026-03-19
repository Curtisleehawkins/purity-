"use client";

import { useState } from "react";
import { BusinessInfo } from "@/lib/types";
import { BUSINESS_INFO as businessInfoData } from "@/lib/mockData";

export default function SettingsPage() {
  const [form, setForm] = useState<BusinessInfo>(businessInfoData);
  const [saved, setSaved] = useState(false);

  const setField = (key: keyof BusinessInfo, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const fields: { key: keyof BusinessInfo; label: string }[] = [
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
        {/* 👆 full width on mobile, capped at 2xl on larger screens */}
        <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4">
          Business Information
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {/* 👇 2-column grid on sm+, single column on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {fields.map(({ key, label }) => (
              <div
                key={key}
                className={
                  // Tagline and Working Hours are wider — full width on all sizes
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

          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              className="bg-primary hover:bg-primary-dark active:scale-95 text-primary-foreground font-medium py-2 px-5 sm:px-6 rounded-lg text-sm transition-all"
            >
              Save Changes
            </button>

            {/* 👇 Success message inline next to button */}
            {saved && (
              <p className="text-primary text-sm font-medium animate-pulse">
                ✓ Saved!
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}