"use client";

import { PageContainer } from "@/app/components/ui/PageContainer";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { EmptyState } from "@/app/components/ui/EmptyState";

/** Admin-only child (see navItems): other roles don't see it and get redirected home. */
export default function HistoricoPage() {
  return (
    <PageContainer>
      <PageHeader title="Histórico" tag="Admin" description="Visible sólo para ADMINISTRADOR." />
      <EmptyState title="Sin histórico" description="Acá iría un reporte de varios períodos." />
    </PageContainer>
  );
}
