"use client";

import { PageContainer } from "@/app/components/ui/PageContainer";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { EmptyState } from "@/app/components/ui/EmptyState";

/** Placeholder for a nav group child — shows the "no data yet" state. */
export default function ResumenPage() {
  return (
    <PageContainer>
      <PageHeader title="Resumen" description="Ejemplo de página dentro de un grupo del menú." />
      <EmptyState title="Sin datos para el período" description="Elegí otro rango de fechas o cargá registros." />
    </PageContainer>
  );
}
