"use client";

import { LayoutDashboard, FolderTree, Package, Users, Settings, ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Categories", url: "/categories", icon: FolderTree },
  { title: "Products", url: "/products", icon: Package },
  { title: "Users", url: "/users", icon: Users },
  { title: "Settings", url: "/settings", icon: Settings },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const AdminSidebar = ({ collapsed, onToggle, onClose }: AdminSidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <aside className={cn(
      "flex flex-col border-r border-border bg-card transition-all duration-300 h-screen",
      collapsed ? "lg:w-16 w-60" : "w-60"
    )}>
      <div className="flex items-center justify-between p-4 border-b border-border">
        <span className={cn(
          "text-lg font-bold text-primary",
          collapsed ? "lg:hidden" : ""
        )}>
          AdminPro
        </span>
        <button
          onClick={onToggle}
          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hidden lg:block"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 py-4 space-y-1 px-2">
        {navItems.map((item) => (
          <Link
            key={item.url}
            href={item.url}
            onClick={onClose}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              pathname === item.url
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            <span className={cn(collapsed ? "lg:hidden" : "")}>{item.title}</span>
          </Link>
        ))}
      </nav>

      <div className="p-2 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium w-full transition-colors text-accent hover:bg-accent/10"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <span className={cn(collapsed ? "lg:hidden" : "")}>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;