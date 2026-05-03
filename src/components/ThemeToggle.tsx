"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 flex items-center justify-center bg-white/50 dark:bg-slate-800/50 rounded-full border border-white dark:border-slate-700 opacity-50">
        <div className="w-5 h-5" />
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-10 h-10 flex items-center justify-center bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 backdrop-blur-md rounded-full border border-white dark:border-slate-600 shadow-sm transition-all duration-300 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 z-50 fixed top-4 right-4 sm:top-6 sm:right-6"
      aria-label="Toggle Dark Mode"
    >
      {isDark ? (
        <Sun className="h-[1.2rem] w-[1.2rem] transition-all" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] transition-all" />
      )}
    </button>
  );
}
