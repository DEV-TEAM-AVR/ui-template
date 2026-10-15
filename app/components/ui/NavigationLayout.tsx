"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { SidebarContent } from "@/app/components/ui/navigation/SidebarContent";
import { getVisibleNavChildren, navItems } from "@/app/components/ui/navigation/navItems";
import { ThemeToggle } from "@/app/components/ui/ThemeToggle";
import { CommandPalette } from "@/app/components/ui/CommandPalette";
import { UserMenu } from "@/app/components/ui/UserMenu";
import { roleIsAllowed } from "@/app/lib/roles";

/** Routes rendered without the shell (full-screen dark auth pages). */
const PUBLIC_ROUTES = ["/login"];

/**
 * App shell: sticky collapsible sidebar on desktop (lg+), slide-in overlay + sticky blurred top
 * bar on mobile. Also the client-side route guard: signed-out → /login; a route whose nav
 * entry the role can't see → "/". The API must still enforce access — this only hides UI.
 */
export function NavigationLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, loading } = useAuth();

  // Restore the desktop collapsed preference after mount (avoids SSR mismatch). Default: collapsed.
  useEffect(() => {
    try {
      const stored = localStorage.getItem("sidebar-collapsed");
      setCollapsed(stored === null ? true : stored === "1");
    } catch {}
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("sidebar-collapsed", next ? "1" : "0");
      } catch {}
      return next;
    });
  };

  const isPublic = PUBLIC_ROUTES.includes(pathname);

  useEffect(() => {
    if (loading) return;
    if (!user && !isPublic) {
      router.push("/login");
      return;
    }
    if (!user) return;

    const item = navItems.find(
      (i) =>
        pathname === i.href ||
        (i.href !== "/" && pathname.startsWith(i.href)) ||
        i.children?.some((c) => pathname === c.href || pathname.startsWith(`${c.href}/`)),
    );
    if (!item) return;
    if (!roleIsAllowed(item.allowedRoles, role)) {
      router.push("/");
      return;
    }
    const child = item.children
      ?.filter((c) => pathname === c.href || pathname.startsWith(`${c.href}/`))
      .sort((a, b) => b.href.length - a.href.length)[0];
    if (child && !getVisibleNavChildren(item, role).some((c) => c.href === child.href)) {
      router.push("/");
    }
  }, [user, role, loading, pathname, router, isPublic]);

  if (isPublic) {
    return <main className="min-h-screen w-full bg-zinc-950 flex items-center justify-center">{children}</main>;
  }

  return (
    <div className="flex min-h-screen w-full">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-shrink-0 sticky top-0 h-screen">
        <SidebarContent collapsed={collapsed} onToggleCollapse={toggleCollapsed} />
      </div>

      {/* Mobile sidebar overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50 cursor-pointer" onClick={() => setOpen(false)} />
          <div className="relative z-10 h-full">
            <SidebarContent onClose={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-h-screen w-full max-w-full overflow-x-hidden relative">
        <main className="flex-1 overflow-y-auto flex flex-col relative w-full max-w-full overflow-x-hidden lg:pt-6">
          {/* Mobile top bar: burger · spacer · theme · account */}
          <div className="lg:hidden flex items-center justify-between px-4 sm:px-6 py-1.5 sm:py-2 z-20 border-b border-zinc-50 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0">
            <button
              onClick={() => setOpen(true)}
              aria-label="Abrir menú"
              className="-ml-2 p-2 rounded-lg text-zinc-500 dark:text-zinc-300 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex-1" />
            <ThemeToggle />
            <UserMenu compact />
          </div>

          {children}
          <CommandPalette />
        </main>
      </div>
    </div>
  );
}
