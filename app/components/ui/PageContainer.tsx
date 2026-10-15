import React from "react";

/**
 * Outer wrapper of every page inside the shell: side gutters, top spacing that lines the title
 * up with the sidebar logo, and vertical rhythm between sections. First child is <PageHeader>.
 */
export function PageContainer({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`px-4 sm:px-6 pt-1 sm:pt-2 pb-8 space-y-6 ${className}`}>{children}</div>;
}
