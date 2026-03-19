//app//(admin)//dashboard/page.tsx
"use client";
import { useEffect, useState } from "react";
import { Package, FolderTree, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type Stats = {
  totalProducts: number;
  totalCategories: number;
  inStock: number;
  outOfStock: number;
};

const DashboardPage = () => {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalCategories: 0,
    inStock: 0,
    outOfStock: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const [
        { count: totalProducts, error: e1 },
        { count: totalCategories, error: e2 },
        { count: inStock, error: e3 },
        { count: outOfStock, error: e4 },
      ] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("categories").select("*", { count: "exact", head: true }),
        supabase.from("products").select("*", { count: "exact", head: true }).eq("in_stock", true),
        supabase.from("products").select("*", { count: "exact", head: true }).eq("in_stock", false),
      ]);

      const err = e1 || e2 || e3 || e4;
      if (err) {
        setError(err.message);
      } else {
        setStats({
          totalProducts: totalProducts ?? 0,
          totalCategories: totalCategories ?? 0,
          inStock: inStock ?? 0,
          outOfStock: outOfStock ?? 0,
        });
      }

      setLoading(false);
    };

    fetchStats();
  }, []);

  const cards = [
    { label: "Total Products", value: stats.totalProducts, icon: Package, color: "bg-primary" },
    { label: "Categories", value: stats.totalCategories, icon: FolderTree, color: "bg-secondary" },
    { label: "In Stock", value: stats.inStock, icon: CheckCircle, color: "bg-primary-light" },
    { label: "Out of Stock", value: stats.outOfStock, icon: XCircle, color: "bg-accent" },
  ];

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">
        Dashboard
      </h1>

      {error && <p className="text-red-500 text-sm mb-4">Error: {error}</p>}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-card border border-border rounded-xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4"
            >
              <div className={`${card.color} h-10 w-10 sm:h-12 sm:w-12 rounded-lg flex items-center justify-center shrink-0`}>
                <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
              </div>
              <div className="min-w-0">
                {loading ? (
                  <div className="h-7 w-10 bg-muted animate-pulse rounded mb-1" />
                ) : (
                  <p className="text-xl sm:text-2xl font-bold text-foreground leading-none">
                    {card.value}
                  </p>
                )}
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 leading-tight">
                  {card.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardPage;