"use client";

import React, { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import SearchIcon from "@mui/icons-material/Search";
import { useAuth } from "@/app/contexts/AuthContext";
import { getVisibleNavChildren, getVisibleNavItems } from "@/app/components/ui/navigation/navItems";

/** Ctrl/⌘+K page switcher over the same nav list the sidebar uses. Mounted once by NavigationLayout. */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { role } = useAuth();
  const visibleItems = getVisibleNavItems(role);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  if (!open) return null;

  const itemCls =
    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-200 aria-selected:bg-brand-50 dark:aria-selected:bg-brand-900/30 aria-selected:text-brand-700 dark:aria-selected:text-brand-400 cursor-pointer transition-colors";

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-zinc-900/40 backdrop-blur-sm px-4"
      onClick={() => setOpen(false)}
    >
      <Command
        className="w-full max-w-lg bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
        }}
        loop
      >
        <div className="flex items-center px-4 border-b border-zinc-100 dark:border-zinc-800">
          <SearchIcon sx={{ fontSize: 20 }} className="text-zinc-400 mr-2" />
          <Command.Input
            autoFocus
            className="w-full h-14 bg-transparent outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 font-medium"
            placeholder="Buscar páginas o acciones..."
          />
          <button
            onClick={() => setOpen(false)}
            className="text-3xs font-bold uppercase tracking-wider text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            ESC
          </button>
        </div>

        <Command.List className="max-h-[300px] overflow-y-auto p-2">
          <Command.Empty className="py-6 text-center text-sm text-zinc-500">No se encontraron resultados.</Command.Empty>

          <Command.Group
            heading="Navegación"
            className="px-2 py-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 [&_[cmdk-group-heading]]:mb-2 [&_[cmdk-group-heading]]:px-2"
          >
            {visibleItems.map((item) => {
              const children = getVisibleNavChildren(item, role);
              return (
                <React.Fragment key={item.href}>
                  {children.length === 0 && (
                    <Command.Item onSelect={() => go(item.href)} className={itemCls}>
                      <span className="opacity-50 shrink-0 text-zinc-500">{item.icon}</span>
                      {item.label}
                    </Command.Item>
                  )}
                  {children.map((child) => (
                    <Command.Item key={child.href} onSelect={() => go(child.href)} className={itemCls}>
                      <span className="opacity-50 shrink-0 text-zinc-500">{item.icon}</span>
                      <span className="text-zinc-400 dark:text-zinc-500">{item.label}</span>
                      <span className="text-zinc-300 dark:text-zinc-600">&rarr;</span>
                      {child.label}
                    </Command.Item>
                  ))}
                </React.Fragment>
              );
            })}
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  );
}
