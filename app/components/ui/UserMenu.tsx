"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { roleLabel } from "@/app/lib/roles";

/**
 * Name + role trigger with a dropdown (extra items, divider, "Cerrar sesión" in red).
 * Rendered by PageHeader on desktop and by NavigationLayout's top bar on mobile.
 * Add entries to USER_MENU_ITEMS — e.g. { label: "Cambiar contraseña", href: "/change-password", icon }.
 */
type UserMenuItem = { label: string; href: string; icon?: React.ReactNode };

const USER_MENU_ITEMS: UserMenuItem[] = [];

const menuItemCls =
  "w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-600 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-brand-600 dark:hover:text-brand-400 transition-colors cursor-pointer";

export function UserMenu({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const { userName, role, signOut } = useAuth();
  const router = useRouter();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-zinc-100/80 dark:hover:bg-zinc-800 active:scale-95 transition-all group cursor-pointer"
      >
        <div className="text-right">
          <p className="text-sm font-bold text-zinc-800 dark:text-zinc-50 leading-tight max-w-[150px] truncate">
            {userName || "Usuario"}
          </p>
          <p
            className={`text-3xs text-brand-600 dark:text-brand-400 font-medium font-mono uppercase tracking-wider ${
              compact ? "hidden sm:block" : ""
            }`}
          >
            {roleLabel(role)}
          </p>
        </div>
        <svg
          className={`w-4 h-4 text-zinc-400 transition-transform duration-200 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40 cursor-pointer" onClick={() => setOpen(false)} />
          {/* z-50: page toolbars sit at z-30 so their own popovers clear tables — the menu must stack above them. */}
          <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-2xl z-50 py-2">
            {compact && (
              <div className="px-4 py-2 mb-1 sm:hidden">
                <p className="text-sm font-bold text-zinc-800 dark:text-zinc-50">{userName || "Usuario"}</p>
                <p className="text-2xs text-brand-600 dark:text-brand-400 font-medium">{roleLabel(role)}</p>
              </div>
            )}

            {USER_MENU_ITEMS.map((item) => (
              <button
                key={item.href}
                onClick={() => {
                  setOpen(false);
                  router.push(item.href);
                }}
                className={menuItemCls}
              >
                {item.icon}
                {item.label}
              </button>
            ))}

            {USER_MENU_ITEMS.length > 0 && <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-1 mx-2" />}

            <button
              onClick={() => {
                setOpen(false);
                signOut();
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Cerrar sesión
            </button>
          </div>
        </>
      )}
    </div>
  );
}
