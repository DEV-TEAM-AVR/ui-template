"use client";

import React from "react";
import { Badge } from "./Badge";
import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "./UserMenu";

interface PageHeaderProps {
  title: React.ReactNode;
  description?: string;
  /** Small pulsing badge before the title ("Nuevo", "Beta"). */
  tag?: string;
  /** Page-level buttons/filters, right-aligned. Primary action last. */
  actions?: React.ReactNode;
  /** Keep the actions block on the same row as the title on mobile too (by default it drops
   *  to its own full-width row below the title under `sm`). For headers whose only action is a
   *  compact control that fits beside a short title. */
  inlineActions?: boolean;
}

/**
 * Every page starts with this: title (+ description) on the left, actions on the right, and on
 * desktop the theme toggle + user menu after a divider (mobile shows those in the top bar).
 * A notification bell, when the project has one, goes next to ThemeToggle.
 */
export const PageHeader = ({ title, description, tag, actions, inlineActions = false }: PageHeaderProps) => {
  return (
    <div
      className={`flex gap-4 mb-2 border-b border-zinc-100 dark:border-zinc-800 pb-3 ${
        inlineActions ? "flex-row items-center justify-between" : "flex-col sm:flex-row sm:items-center sm:justify-between"
      }`}
    >
      {/* Title — sized to its content (not flex-1) so a wide actions row can use the leftover width. */}
      <div className="min-w-0 space-y-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {tag && (
            <Badge variant="success" className="uppercase tracking-wide font-semibold text-3xs px-2 py-0.5 animate-pulse">
              {tag}
            </Badge>
          )}
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight">
            {title}
          </h1>
        </div>
        {description && (
          <p
            className={`text-zinc-500 dark:text-zinc-400 max-w-2xl text-xs sm:text-sm leading-snug ${
              inlineActions ? "hidden sm:block" : ""
            }`}
          >
            {description}
          </p>
        )}
      </div>

      <div
        className={`flex items-center gap-3 sm:gap-4 justify-end ${
          inlineActions ? "w-auto shrink-0" : "w-full sm:w-auto sm:flex-1 sm:min-w-0"
        }`}
      >
        {actions && (
          <div className="flex flex-1 min-w-0 flex-wrap items-center justify-end gap-2 sm:gap-3">{actions}</div>
        )}

        {/* Desktop-only theme + account (mobile: NavigationLayout's top bar) */}
        <div className="hidden lg:flex items-center gap-3 border-l border-zinc-200 dark:border-zinc-700 pl-4 h-9">
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </div>
  );
};
