// components/layout/AdminSidebar.tsx
"use client";
import { LayoutDashboard, FolderTree, Package, Users, Settings, ChevronLeft, ChevronRight, LogOut, TestTube2Icon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Categories", url: "/categories", icon: FolderTree },
  { title: "Products", url: "/products", icon: Package },
  { title: "Users", url: "/users", icon: Users },
  { title: "Settings", url: "/settings", icon: Settings },
   { title: "testing", url: "/test", icon: TestTube2Icon },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onClose: () => void; // 👈 new prop to close drawer on mobile nav click
}

const AdminSidebar = ({ collapsed, onToggle, onClose }: AdminSidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    router.push("/");
  };

  return (
    <aside className={cn(
      "flex flex-col border-r border-border bg-card transition-all duration-300 h-screen",
      // 👇 On mobile always full width (w-60), collapse only applies on lg+
      collapsed ? "lg:w-16 w-60" : "w-60"
    )}>
      <div className="flex items-center justify-between p-4 border-b border-border">
        {/* 👇 Always show logo on mobile regardless of collapsed state */}
        <span className={cn(
          "text-lg font-bold text-primary",
          collapsed ? "lg:hidden" : ""   // hide on lg when collapsed, always show on mobile
        )}>
          AdminPro
        </span>
        {/* 👇 Toggle button only visible on lg+ (mobile uses overlay close instead) */}
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
            onClick={onClose} // 👈 close drawer when navigating on mobile
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              pathname === item.url
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {/* 👇 Always show labels on mobile, hide when collapsed on lg+ */}
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