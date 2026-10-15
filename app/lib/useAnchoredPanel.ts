"use client";

import { useLayoutEffect, useState, type CSSProperties, type RefObject } from "react";

interface AnchoredPanelOptions {
  /** Desired panel width in px (shrinks to fit narrow viewports). */
  width: number;
  /** "start" aligns the panel's left edge with the anchor's; "end" aligns right edges. */
  align?: "start" | "end";
  /** Gap between anchor and panel. */
  gap?: number;
  /** Minimum distance kept from the viewport edges. */
  margin?: number;
}

/**
 * Fixed-position style for a dropdown panel rendered in a portal, anchored to `anchorRef`.
 * Because the panel escapes its ancestors, cards with overflow clipping (or a trigger near
 * the right edge of a narrow column) can no longer cut it off: the panel is clamped inside
 * the viewport horizontally, and opens upward when there's more room above than below.
 * Tracks scroll (any scroll container) and resize while open.
 */
export function useAnchoredPanel(
  open: boolean,
  anchorRef: RefObject<HTMLElement | null>,
  { width, align = "start", gap = 4, margin = 8 }: AnchoredPanelOptions
): CSSProperties {
  const [style, setStyle] = useState<CSSProperties>({ position: "fixed", visibility: "hidden" });

  useLayoutEffect(() => {
    if (!open) return;
    const update = () => {
      const el = anchorRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vw = document.documentElement.clientWidth;
      const vh = window.innerHeight;
      const w = Math.min(width, vw - margin * 2);
      const preferredLeft = align === "end" ? r.right - w : r.left;
      const left = Math.max(margin, Math.min(preferredLeft, vw - w - margin));
      const spaceBelow = vh - r.bottom - gap - margin;
      const spaceAbove = r.top - gap - margin;
      const openUp = spaceBelow < 220 && spaceAbove > spaceBelow;
      setStyle(
        openUp
          ? { position: "fixed", left, width: w, bottom: vh - r.top + gap, maxHeight: spaceAbove }
          : { position: "fixed", left, width: w, top: r.bottom + gap, maxHeight: spaceBelow }
      );
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open, anchorRef, width, align, gap, margin]);

  return style;
}
