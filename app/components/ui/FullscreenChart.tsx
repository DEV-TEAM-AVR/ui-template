"use client";

import React, { useState } from "react";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";

// Fullscreen overlay for charts. On portrait viewports (phones) the chart is
// rotated 90° and sized to the swapped viewport dimensions so wide charts
// always read in landscape.
const FULLSCREEN_CLASSES =
  "fixed inset-0 z-[100] bg-white dark:bg-zinc-950 flex flex-col p-2 overflow-hidden landscape:flex-row " +
  "portrait:w-[100vh] portrait:h-[100vw] portrait:top-1/2 portrait:left-1/2 " +
  "portrait:-translate-x-1/2 portrait:-translate-y-1/2 portrait:rotate-90 portrait:p-4";

interface FullscreenChartProps {
  /** Chart container classes when inline, e.g. "w-full h-[520px] mt-2". */
  className: string;
  /** Rendered to the left of the toggle button; hidden while in fullscreen. */
  header?: React.ReactNode;
  /** Chart content; the flag lets charts tweak margins/legend in fullscreen. */
  children: React.ReactNode | ((fullScreen: boolean) => React.ReactNode);
}

/** Chart wrapper with a fullscreen toggle, shared by the report pages. */
export function FullscreenChart({ className, header, children }: FullscreenChartProps) {
  const [fullScreen, setFullScreen] = useState(false);

  return (
    <>
      <div className={fullScreen ? "hidden" : "flex items-start justify-between gap-2"}>
        <div className="flex-1 min-w-0">{header}</div>
        <button
          type="button"
          onClick={() => setFullScreen(true)}
          title="Pantalla completa"
          className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-lg shrink-0 cursor-pointer"
        >
          <FullscreenIcon />
        </button>
      </div>
      <div className={fullScreen ? FULLSCREEN_CLASSES : className}>
        {fullScreen && (
          <button
            type="button"
            onClick={() => setFullScreen(false)}
            title="Salir de pantalla completa"
            className="absolute top-4 right-4 z-50 p-2 bg-zinc-100/80 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg backdrop-blur-sm cursor-pointer"
          >
            <FullscreenExitIcon />
          </button>
        )}
        {typeof children === "function" ? children(fullScreen) : children}
      </div>
    </>
  );
}
