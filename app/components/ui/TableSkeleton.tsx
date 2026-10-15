"use client";

import React from "react";
import { Skeleton } from "./Skeleton";

interface Props {
  rows?: number;
  columns?: number;
  className?: string;
}

export function TableSkeleton({ rows = 5, columns = 4, className = "" }: Props) {
  return (
    <div className={`w-full border border-zinc-200 dark:border-zinc-700 rounded-2xl overflow-hidden bg-white dark:bg-zinc-950 shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-4 py-3">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="flex-1 pr-4">
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
      
      {/* Rows */}
      <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex px-4 py-4">
            {Array.from({ length: columns }).map((_, c) => (
              <div key={c} className="flex-1 pr-4">
                <Skeleton className={`h-4 ${c === 0 ? "w-3/4" : "w-1/2"}`} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
