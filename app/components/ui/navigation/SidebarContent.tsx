"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { brand } from "@/app/config/brand";
import { getVisibleNavChildren, getVisibleNavItems, type NavItem } from "@/app/components/ui/navigation/navItems";

/**
 * The dark sidebar: logo, collapse toggle, nav groups (expandable, auto-open on the active
 * child), footer with "developed by" + version. Always dark (zinc-950) in both themes.
 * Active item = brand-tinted pill (bg-brand-500/10 text-brand-400 border-brand-500/20).
 */
export function SidebarContent({
  onClose,
  collapsed = false,
  onToggleCollapse,
}: {
  onClose?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  const pathname = usePathname();
  const { role, loading } = useAuth();

  const filteredNavItems = useMemo(() => getVisibleNavItems(role), [role]);

  const isPathActive = useCallback(
    (href: string) => pathname === href || pathname.startsWith(`${href}/`),
    [pathname],
  );

  const getFilteredChildren = useCallback((item: NavItem) => getVisibleNavChildren(item, role), [role]);

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const item of filteredNavItems) {
      const children = getFilteredChildren(item);
      if (children.length === 0) continue;
      initial[item.href] = children.some((c) => isPathActive(c.href));
    }
    return initial;
  });

  // Navigating into a group (link, Ctrl+K) opens it.
  useEffect(() => {
    setExpandedGroups((prev) => {
      let changed = false;
      const next = { ...prev };
      for (const item of filteredNavItems) {
        const children = getFilteredChildren(item);
        if (children.length === 0) continue;
        if (children.some((c) => isPathActive(c.href)) && !next[item.href]) {
          next[item.href] = true;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [pathname, role, filteredNavItems, getFilteredChildren, isPathActive]);

  const itemCls = (active: boolean) =>
    `flex items-center gap-3 ${collapsed ? "px-2 justify-center" : "px-4"} py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer select-none ${
      active
        ? "bg-brand-500/10 text-brand-400 border border-brand-500/20"
        : "text-zinc-400 hover:text-white hover:bg-zinc-800"
    }`;

  return (
    <aside
      className={`${collapsed ? "w-20" : "w-64"} h-full bg-zinc-950 text-white flex flex-col border-r border-zinc-800 overflow-hidden transition-[width] duration-200`}
    >
      {/* Logo */}
      <div className={`flex-shrink-0 p-6 pb-2 flex items-center ${collapsed ? "justify-center" : "justify-between"}`}>
        <Link
          href="/"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          title={collapsed ? brand.name : undefined}
        >
          <Image
            src={brand.logo}
            alt={`${brand.name} Logo`}
            width={32}
            height={32}
            className="rounded-lg shadow-brand-500/20 shadow-lg"
          />
          {!collapsed && <h1 className="text-xl font-bold tracking-tight">{brand.name}</h1>}
        </Link>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-zinc-400 hover:text-white p-1 cursor-pointer" aria-label="Cerrar menú">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Desktop collapse toggle */}
      {onToggleCollapse && (
        <div className={`hidden lg:flex flex-shrink-0 px-6 ${collapsed ? "justify-center" : "justify-end"}`}>
          <button
            onClick={onToggleCollapse}
            title={collapsed ? "Expandir menú" : "Colapsar menú"}
            aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
            className="text-zinc-400 hover:text-white hover:bg-zinc-800 p-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <svg className={`w-4 h-4 transition-transform ${collapsed ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>
      )}

      {/* Nav */}
      <nav className={`flex-grow overflow-y-auto ${collapsed ? "px-3" : "px-6"} pt-4 pb-6 flex flex-col gap-1 sidebar-scrollbar`}>
        {loading ? (
          <div className="flex flex-col gap-3 px-4">
            <div className="h-10 bg-zinc-800/50 rounded-xl animate-pulse" />
            <div className="h-10 bg-zinc-800/50 rounded-xl animate-pulse" />
            <div className="h-10 bg-zinc-800/50 rounded-xl animate-pulse" />
          </div>
        ) : (
          filteredNavItems.map((item) => {
            const children = getFilteredChildren(item);

            if (children.length > 0) {
              const activeChildHref = children
                .filter((c) => isPathActive(c.href))
                .sort((a, b) => b.href.length - a.href.length)[0]?.href;
              const groupActive = Boolean(activeChildHref);
              const isExpanded = expandedGroups[item.href] ?? groupActive;
              return (
                <div key={item.href}>
                  <div
                    onClick={() =>
                      collapsed && onToggleCollapse
                        ? onToggleCollapse()
                        : setExpandedGroups((prev) => ({ ...prev, [item.href]: !(prev[item.href] ?? groupActive) }))
                    }
                    title={collapsed ? item.label : undefined}
                    className={itemCls(groupActive)}
                  >
                    {collapsed ? (
                      <span className="shrink-0">{item.icon}</span>
                    ) : (
                      <>
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {item.icon}
                          <span className="truncate">{item.label}</span>
                        </div>
                        <svg
                          className={`w-4 h-4 shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </>
                    )}
                  </div>
                  {!collapsed && isExpanded && (
                    <div className="flex flex-col gap-0.5 ml-4 pl-4 border-l border-zinc-800">
                      {children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={onClose}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            child.href === activeChildHref
                              ? "bg-brand-500/10 text-brand-400 border border-brand-500/20"
                              : "text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                title={collapsed ? item.label : undefined}
                className={itemCls(active)}
              >
                <span className="shrink-0">{item.icon}</span>
                {!collapsed && item.label}
              </Link>
            );
          })
        )}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="flex-shrink-0 p-6 pt-4 border-t border-zinc-800">
          {brand.developedBy && (
            <div>
              <p className="text-3xs text-zinc-500 font-medium">Desarrollado por:</p>
              <p className="text-xs text-zinc-400 font-semibold mt-0.5">{brand.developedBy}</p>
            </div>
          )}
          <p className="text-xs text-zinc-500 mt-4 italic text-right truncate">v{process.env.NEXT_PUBLIC_APP_VERSION}</p>
        </div>
      )}
    </aside>
  );
}
