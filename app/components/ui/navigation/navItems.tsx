import React from "react";
import { ROLES, roleIsAllowed } from "@/app/lib/roles";

/**
 * The sidebar, the command palette (Ctrl+K) and the route guard in NavigationLayout all read
 * this one list. Add a page = add an entry here. Icons are 20px outline SVGs (w-5 h-5,
 * stroke 2) — keep that style; heroicons-outline paths drop straight in.
 */
export type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  children?: NavChild[];
  /** Omit = every signed-in role. */
  allowedRoles?: string[];
};

export type NavChild = {
  label: string;
  href: string;
  /** Defaults to the parent's allowedRoles. */
  allowedRoles?: string[];
};

const icon = (d: string) => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
  </svg>
);

export const navItems: NavItem[] = [
  {
    label: "Inicio",
    href: "/",
    icon: icon(
      "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    ),
  },
  {
    label: "Registros",
    href: "/ejemplo",
    icon: icon(
      "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
    ),
    children: [
      { label: "Listado", href: "/ejemplo" },
      { label: "Semanal", href: "/ejemplo/semanal" },
    ],
  },
  {
    label: "Reportes",
    href: "/reportes",
    icon: icon(
      "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    ),
    children: [
      { label: "Resumen", href: "/reportes/resumen" },
      { label: "Histórico", href: "/reportes/historico", allowedRoles: [ROLES.ADMIN] },
    ],
    allowedRoles: [ROLES.ADMIN, ROLES.MANAGER],
  },
  {
    label: "UI Kit",
    href: "/ui-kit",
    icon: icon(
      "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01",
    ),
  },
];

export function getVisibleNavItems(role: string): NavItem[] {
  return navItems.filter((item) => roleIsAllowed(item.allowedRoles, role));
}

export function getVisibleNavChildren(item: NavItem, role: string): NavChild[] {
  if (!item.children) return [];
  return item.children.filter((child) => roleIsAllowed(child.allowedRoles ?? item.allowedRoles, role));
}
