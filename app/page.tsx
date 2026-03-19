// app/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { mockUsers } from "@/lib/mockData";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const demoUser = mockUsers[0];

  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated");
    if (isAuth === "true") {
      router.push("/dashboard");
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const user = mockUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("currentUser", JSON.stringify(user));
      router.push("/dashboard");
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8 sm:px-6">
      {/* 👆 py-8 ensures breathing room on short mobile screens */}
      <div className="w-full max-w-sm sm:max-w-md">
        {/* 👆 max-w-sm on mobile (tighter), max-w-md on sm+ */}
        <div className="bg-card rounded-xl shadow-lg border border-border p-6 sm:p-8">
          {/* 👆 less padding on mobile (p-6), more on larger screens (p-8) */}

          <div className="text-center mb-6 sm:mb-8">
            {/* 👆 tighter margin on mobile */}
            <h1 className="text-xl sm:text-2xl font-bold text-primary mb-1">AdminPro</h1>
            {/* 👆 slightly smaller heading on mobile */}
            <p className="text-muted-foreground text-xs sm:text-sm">Sign in to your admin panel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {/* 👆 tighter spacing between fields on mobile */}
            {error && (
              <div className="bg-accent/10 text-accent text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="text-xs sm:text-sm font-medium text-foreground block mb-1 sm:mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 sm:py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="admin@example.com"
                autoComplete="email"       // 👈 helps mobile keyboards suggest saved emails
                autoCapitalize="none"      // 👈 prevents mobile from capitalizing email
                autoCorrect="off"          // 👈 prevents autocorrect on email field
                required
              />
            </div>

            <div>
              <label className="text-xs sm:text-sm font-medium text-foreground block mb-1 sm:mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 sm:py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="••••••••"
                autoComplete="current-password"  // 👈 helps mobile password managers
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark active:scale-95 text-primary-foreground font-medium py-2.5 sm:py-3 rounded-lg text-sm transition-all mt-1"
            >
              {/* 👆 active:scale-95 gives tactile press feedback on touch screens */}
              Sign In
            </button>
          </form>

          <div className="mt-5 sm:mt-6 text-center">
            <p className="text-xs text-muted-foreground">Demo credentials</p>
            <div className="mt-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-0">
              {/* 👆 stacks vertically on mobile, inline on sm+ */}
              <span className="font-mono text-xs text-foreground">{demoUser.email}</span>
              <span className="hidden sm:inline text-muted-foreground mx-1">/</span>
              <span className="font-mono text-xs text-foreground">{demoUser.password}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;