// app/(admin)/dashboard/page.tsx
"use client";

import { Package, FolderTree, CheckCircle, XCircle } from "lucide-react";
import { products, categories } from "@/lib/mockData";

const DashboardPage = () => {
  const inStock = products.filter((p) => p.inStock).length;
  const outOfStock = products.filter((p) => !p.inStock).length;

  const cards = [
    { label: "Total Products", value: products.length, icon: Package, color: "bg-primary" },
    { label: "Categories", value: categories.length, icon: FolderTree, color: "bg-secondary" },
    { label: "In Stock", value: inStock, icon: CheckCircle, color: "bg-primary-light" },
    { label: "Out of Stock", value: outOfStock, icon: XCircle, color: "bg-accent" },
  ];

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">
        Dashboard
      </h1>

      {/* 👇 2 cols on mobile, 4 on lg */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-card border border-border rounded-xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4"
            >
              {/* 👇 Smaller icon box on mobile */}
              <div className={`${card.color} h-10 w-10 sm:h-12 sm:w-12 rounded-lg flex items-center justify-center shrink-0`}>
                <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-foreground leading-none">
                  {card.value}
                </p>
                {/* 👇 Smaller label, allow wrap */}
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