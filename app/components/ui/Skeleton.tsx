"use client";

import React from "react";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular" | "rounded";
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = "", variant = "text" }) => {
  const baseClass = "animate-pulse bg-zinc-200/80 dark:bg-zinc-800";
  
  let variantClass = "";
  switch (variant) {
    case "circular":
      variantClass = "rounded-full";
      break;
    case "rectangular":
      variantClass = "";
      break;
    case "rounded":
      variantClass = "rounded-2xl";
      break;
    case "text":
    default:
      variantClass = "rounded h-4 w-full mb-2";
      break;
  }

  return <div className={`${baseClass} ${variantClass} ${className}`} />;
};
