"use client";

import { useEffect, useState } from "react";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

type ThemeMode = "light" | "dark";

export function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as ThemeMode | null;
    if (saved === "dark") {
      setMode("dark");
    } else {
      setMode("light");
    }
  }, []);

  const toggleTheme = () => {
    const nextMode: ThemeMode = mode === "dark" ? "light" : "dark";
    setMode(nextMode);
    localStorage.setItem("theme", nextMode);
    
    if (nextMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors"
      title={`Theme: ${mode}`}
    >
      {mode === "light" ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
    </button>
  );
}
