"use client";

import { useState } from "react";
import Link from "next/link";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { PageContainer } from "@/app/components/ui/PageContainer";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { StatCard } from "@/app/components/ui/StatCard";
import { Card } from "@/app/components/ui/Card";
import { SegmentedControl } from "@/app/components/ui/SegmentedControl";
import { ToggleChip } from "@/app/components/ui/ToggleChip";
import { TableContainer, Table, THead, TBody, TFoot, TR, TH, TD } from "@/app/components/ui/Table";
import { buttonClasses } from "@/app/components/ui/Button";
import { text } from "@/app/components/ui/typography";
import { formatInteger, formatMoney, formatPercent } from "@/app/lib/utils/number-format";

/** Example dashboard: KPI row + a card with header controls + a compact table. Replace freely. */
const rows = [
  { sucursal: "Norte", pedidos: 1240, ventas: 48210.5, cumplimiento: 96.2 },
  { sucursal: "Centro", pedidos: 980, ventas: 39100, cumplimiento: 91.4 },
  { sucursal: "Sur", pedidos: 1532, ventas: 61875.25, cumplimiento: 98.7 },
  { sucursal: "Oeste", pedidos: 410, ventas: 15020.75, cumplimiento: 84.0 },
];

export default function DashboardPage() {
  const [mode, setMode] = useState<"semana" | "mes">("semana");
  const [incluirInactivas, setIncluirInactivas] = useState(true);

  const totalPedidos = rows.reduce((s, r) => s + r.pedidos, 0);
  const totalVentas = rows.reduce((s, r) => s + r.ventas, 0);

  return (
    <PageContainer>
      <PageHeader
        title="Inicio"
        description="Resumen de la operación."
        actions={
          <Link href="/ejemplo" className={buttonClasses({ variant: "primary", size: "sm" })}>
            Ir a registros
            <ArrowForwardIcon sx={{ fontSize: 16 }} />
          </Link>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Pedidos" value={formatInteger(totalPedidos)} delta={4.1} deltaLabel="+4.1% vs semana anterior" />
        <StatCard label="Ventas" value={formatMoney(totalVentas)} delta={-1.8} deltaLabel="-1.8% vs semana anterior" />
        <StatCard label="Cumplimiento" value={formatPercent(92.6)} deltaLabel="Meta 95%" />
        <StatCard label="Reclamos" value="12" delta={-3} deltaLabel="3 menos" goodWhen="down" />
      </div>

      <Card className="p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className={text.section}>Totales por sucursal</h2>
          <div className="flex items-center gap-1">
            <ToggleChip checked={incluirInactivas} onChange={setIncluirInactivas} title="Incluir sucursales inactivas">
              Inactivas
            </ToggleChip>
            <SegmentedControl
              size="xs"
              value={mode}
              onChange={setMode}
              options={[
                { value: "semana", label: "Semana" },
                { value: "mes", label: "Mes" },
              ]}
            />
          </div>
        </div>
        <TableContainer>
          <Table density="compact">
            <THead>
              <TR>
                <TH>Sucursal</TH>
                <TH numeric>Pedidos</TH>
                <TH numeric>Ventas</TH>
                <TH numeric>Cumplimiento</TH>
              </TR>
            </THead>
            <TBody>
              {rows.map((r) => (
                <TR key={r.sucursal}>
                  <TD className="font-semibold">{r.sucursal}</TD>
                  <TD numeric>{formatInteger(r.pedidos)}</TD>
                  <TD numeric>{formatMoney(r.ventas)}</TD>
                  <TD numeric className={r.cumplimiento < 90 ? "text-red-600 dark:text-red-400" : ""}>
                    {formatPercent(r.cumplimiento)}
                  </TD>
                </TR>
              ))}
            </TBody>
            <TFoot>
              <TR total>
                <TD>Total</TD>
                <TD numeric>{formatInteger(totalPedidos)}</TD>
                <TD numeric>{formatMoney(totalVentas)}</TD>
                <TD numeric>—</TD>
              </TR>
            </TFoot>
          </Table>
        </TableContainer>
      </Card>
    </PageContainer>
  );
}
