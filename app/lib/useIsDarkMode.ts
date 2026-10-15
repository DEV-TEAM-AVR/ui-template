"use client";

import { useEffect, useState } from "react";

/** Tracks the `dark` class on <html> (toggled by ThemeToggle / layout script). */
export function useIsDarkMode(): boolean {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const el = document.documentElement;
    const update = () => setIsDark(el.classList.contains("dark"));
    update();
    const observer = new MutationObserver(update);
    observer.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return isDark;
}

/**
 * Theme-aware colors for recharts grid/tick/axis strokes, which take raw hex
 * values and can't use Tailwind dark: classes.
 */
export function useChartAxisColors() {
  const isDark = useIsDarkMode();
  return isDark
    ? { grid: "#3f3f46", tick: "#a1a1aa", axis: "#52525b" } // zinc-700 / zinc-400 / zinc-600
    : { grid: "#e4e4e7", tick: "#52525b", axis: "#a1a1aa" }; // zinc-200 / zinc-600 / zinc-400
}
