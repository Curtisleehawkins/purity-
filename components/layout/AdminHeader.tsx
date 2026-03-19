"use client";

import { Bell, User, Menu } from "lucide-react";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";

interface AdminHeaderProps {
  onMenuClick: () => void;
}

const AdminHeader = ({ onMenuClick }: AdminHeaderProps) => {
  const { currentUser, loading } = useCurrentUser();

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <h2 className="text-sm font-medium text-muted-foreground">
          Welcome back,{" "}
          <span className="text-foreground">
            {loading ? "" : (currentUser?.name ?? "Admin")}
          </span>
        </h2>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button className="relative p-2 rounded-lg hover:bg-muted text-muted-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-accent rounded-full" />
        </button>

        <div className="flex items-center gap-2 text-sm">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0">
            <User className="h-4 w-4 text-primary-foreground" />
          </div>
          {!loading && (
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-foreground font-medium">
                {currentUser?.name ?? "Admin"}
              </span>
              <span className="text-muted-foreground text-xs">
                {currentUser?.email ?? ""}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;