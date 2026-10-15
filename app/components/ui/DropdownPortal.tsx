"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface DropdownPortalProps {
  anchorRef: React.RefObject<HTMLElement | null>;
  panelRef?: React.RefObject<HTMLDivElement | null>;
  open: boolean;
  className?: string;
  children: React.ReactNode;
}

const MARGIN = 8;
const PREFERRED_MAX_HEIGHT = 384; // matches the old max-h-96
const MIN_HEIGHT = 120;

interface Placement {
  left: number;
  width: number;
  maxHeight: number;
  top?: number;
  bottom?: number;
}

/**
 * Renders a floating panel into document.body, positioned next to `anchorRef`.
 * Custom dropdowns positioned with `position: absolute` inside a scrollable
 * modal (MUI Dialog's `overflowY: auto` content) get clipped once the anchor
 * sits near the bottom of the visible area — portaling escapes that overflow
 * clipping the same way MUI's own Popper/Autocomplete do.
 *
 * Also flips upward and clamps its height to the viewport: without this, a
 * panel anchored near the bottom of the screen (not just the modal) would
 * still render past the bottom edge with a fixed max-height.
 */
export function DropdownPortal({ anchorRef, panelRef, open, className = "", children }: DropdownPortalProps) {
  const [placement, setPlacement] = useState<Placement | null>(null);
  // The panel can be wider than its anchor (min-w-* on an icon trigger): once rendered, shift it
  // left so it doesn't run past the right edge of the viewport.
  const ownRef = useRef<HTMLDivElement | null>(null);
  const boxRef = panelRef ?? ownRef;
  const [shiftX, setShiftX] = useState(0);

  useLayoutEffect(() => {
    if (!open || !placement || !boxRef.current) return;
    const w = boxRef.current.offsetWidth;
    const overflow = placement.left + w - (window.innerWidth - MARGIN);
    setShiftX(overflow > 0 ? Math.min(overflow, Math.max(0, placement.left - MARGIN)) : 0);
  }, [open, placement, boxRef]);

  useEffect(() => {
    if (!open) return;
    const update = () => {
      const el = anchorRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const spaceBelow = window.innerHeight - r.bottom - MARGIN;
      const spaceAbove = r.top - MARGIN;

      const openUpward = spaceBelow < PREFERRED_MAX_HEIGHT && spaceAbove > spaceBelow;
      const maxHeight = Math.max(MIN_HEIGHT, Math.min(PREFERRED_MAX_HEIGHT, openUpward ? spaceAbove : spaceBelow));

      setPlacement(
        openUpward
          ? { bottom: window.innerHeight - r.top + 4, left: r.left, width: r.width, maxHeight }
          : { top: r.bottom + 4, left: r.left, width: r.width, maxHeight }
      );
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open, anchorRef]);

  if (!open || !placement || typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={boxRef}
      className={className}
      style={{
        position: "fixed",
        top: placement.top,
        bottom: placement.bottom,
        left: placement.left - shiftX,
        width: placement.width,
        maxHeight: placement.maxHeight,
        zIndex: 1400,
      }}
    >
      {children}
    </div>,
    document.body
  );
}
