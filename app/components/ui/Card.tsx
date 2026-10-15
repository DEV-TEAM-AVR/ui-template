"use client";

import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

/** The standard surface for a page section: white panel, card radius, zinc border. */
export const Card = ({ children, className = "", id }: CardProps) => {
  return (
    <div
      id={id}
      className={`rounded-card bg-white dark:bg-zinc-950 border-[1.5px] border-zinc-300 dark:border-zinc-800 transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader = ({ children, className = "" }: CardHeaderProps) => {
  return (
    <div className={`px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 ${className}`}>
      {children}
    </div>
  );
};

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const CardBody = ({ children, className = "" }: CardBodyProps) => {
  return <div className={`px-6 py-5 ${className}`}>{children}</div>;
};
