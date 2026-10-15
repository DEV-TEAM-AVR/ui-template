"use client";

import React from "react";
import { Skeleton } from "./Skeleton";

interface Props {
  count?: number;
  className?: string;
}

export function CardSkeleton({ count = 3, className = "" }: Props) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-5 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton variant="circular" className="h-8 w-8" />
          </div>
          <div className="space-y-2 mt-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <div className="mt-4 flex gap-2">
            <Skeleton className="h-8 w-20 rounded-lg" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
