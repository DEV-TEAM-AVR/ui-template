"use client";

import React, { useMemo, useState } from "react";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import { PageContainer } from "@/app/components/ui/PageContainer";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { PeriodNavigator } from "@/app/components/ui/PeriodNavigator";
import { GridCard } from "@/app/components/ui/GridCard";
import { GroupedGrid, type GridGroup, type GridRow } from "@/app/components/ui/GroupedGrid";
import { Modal } from "@/app/components/ui/Modal";
import { NumericStepper } from "@/app/components/ui/NumericStepper";
import { Button } from "@/app/components/ui/Button";
import { notify } from "@/app/components/ui/Notifier";
import { formatDate } from "@/app/lib/utils/date-format";
import { formatInteger } from "@/app/lib/utils/number-format";

/**
 * Reference weekly data-entry screen (the GAP-AVR "Registros" layout): week navigator →
 * one GridCard per entity (black bar) → GroupedGrid sections with tinted column bands, a TOTAL
 * per band, a running SALDOS column and a footer. Click a value to edit it, an empty "–" to create.
 */
const DIAS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const ALMACENES = [
  { cod: "A1", nombre: "Almacén Norte", lotes: ["Lote 1", "Lote 2"], stockInicial: 5200 },
  { cod: "A2", nombre: "Almacén Sur", lotes: ["Lote 3", "Lote 4", "Lote 5"], stockInicial: 8100 },
];

const iso = (d: Date) => d.toLocaleDateString("en-CA");
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
/** Weeks run Monday → Sunday. */
const mondayOf = (d: Date) => addDays(d, -((d.getDay() + 6) % 7));

// Deterministic demo values so server and client render the same numbers.
function seedValue(...parts: string[]) {
  let h = 0;
  for (const ch of parts.join("|")) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h;
}

const STOCK_GROUPS = (lotes: string[]): GridGroup[] => [
  { key: "merma", label: "Merma", tone: "red", columns: lotes.map((l) => ({ key: l, label: l })) },
  { key: "ingresos", label: "Ingresos", tone: "positive", columns: lotes.map((l) => ({ key: l, label: l })) },
  { key: "salidas", label: "Salidas / Traspasos", tone: "orange", columns: lotes.map((l) => ({ key: l, label: l })) },
];
const PROD_GROUPS = (lotes: string[]): GridGroup[] => [
  { key: "produccion", label: "Producción", tone: "blue", columns: lotes.map((l) => ({ key: l, label: l })) },
  { key: "entregas", label: "Entregas", tone: "indigo", columns: [{ key: "cliente", label: "Clientes" }, { key: "interno", label: "Interno" }] },
  { key: "peso", label: "Peso prom. (g)", tone: "teal", aggregate: "avg", columns: lotes.map((l) => ({ key: l, label: l })) },
];

// Fixed "today" for the demo, so the statically rendered page matches the client. A real page
// uses the business-timezone today.
const DEMO_TODAY = new Date(2026, 9, 15);

export default function SemanalPage() {
  const [weekStart, setWeekStart] = useState(() => mondayOf(DEMO_TODAY));
  // Overrides typed by the user: key `${almacen}|${group}|${col}|${fecha}`.
  const [edits, setEdits] = useState<Record<string, number>>({});
  const [editing, setEditing] = useState<{ key: string; titulo: string; valor: number } | null>(null);

  const weekDates = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);
  const rows: GridRow[] = weekDates.map((d) => ({ key: iso(d), label: DIAS[d.getDay()], sublabel: d.getDate() }));

  const value = (alm: string, g: GridGroup, col: string, fecha: string): number | null => {
    const key = `${alm}|${g.key}|${col}|${fecha}`;
    if (key in edits) return edits[key];
    const h = seedValue(key);
    if (h % 5 === 0) return null; // some empty cells to create
    switch (g.key) {
      case "merma": return h % 7;
      case "ingresos": return h % 4 === 0 ? 100 + (h % 300) : null;
      case "salidas": return h % 6 === 0 ? 50 + (h % 120) : null;
      case "produccion": return 400 + (h % 250);
      case "entregas": return h % 3 === 0 ? 300 + (h % 900) : null;
      case "peso": return 1800 + (h % 90);
      default: return null;
    }
  };

  const saldo = (alm: (typeof ALMACENES)[number], hastaFecha: string) => {
    let s = alm.stockInicial;
    for (const d of weekDates) {
      const f = iso(d);
      if (f > hastaFecha) break;
      for (const g of STOCK_GROUPS(alm.lotes)) {
        for (const c of g.columns) {
          const v = value(alm.cod, g, c.key, f) ?? 0;
          s += g.key === "ingresos" ? v : -v;
        }
      }
    }
    return s;
  };

  const today = iso(DEMO_TODAY);
  const weekLabel = `${formatDate(weekDates[0], { day: "numeric", month: "short" })} – ${formatDate(weekDates[6], { day: "numeric", month: "short", year: "numeric" })}`;

  return (
    <PageContainer>
      <PageHeader title="Registros semanales" description="Ejemplo de grilla de carga semanal: una tarjeta por almacén, secciones con grupos de columnas." />

      <PeriodNavigator
        label={weekLabel}
        isCurrent={iso(mondayOf(DEMO_TODAY)) === iso(weekStart)}
        badge={`Sem. ${Math.ceil(((weekStart.getTime() - new Date(weekStart.getFullYear(), 0, 1).getTime()) / 86400000 + 1) / 7)} del año`}
        onPrev={() => setWeekStart((w) => addDays(w, -7))}
        onNext={() => setWeekStart((w) => addDays(w, 7))}
        nextDisabled={iso(weekStart) > today}
      />

      {ALMACENES.map((alm) => {
        const onCellClick = (row: GridRow, g: GridGroup, col: { key: string; label: React.ReactNode }, v: number | null | undefined) =>
          setEditing({
            key: `${alm.cod}|${g.key}|${col.key}|${row.key}`,
            titulo: `${g.label} · ${col.label} · ${formatDate(`${row.key}T00:00:00`)}`,
            valor: v ?? 0,
          });
        return (
          <GridCard
            key={alm.cod}
            icon={<WarehouseIcon sx={{ fontSize: 18 }} />}
            title={alm.nombre}
            meta={`${alm.lotes.length} lotes`}
            chips={alm.lotes.map((l, i) => `${l} · Sem. ${10 + i * 3}`)}
          >
            <GroupedGrid
              title="Stock"
              rows={rows}
              groups={STOCK_GROUPS(alm.lotes)}
              getValue={(r, g, c) => value(alm.cod, g, c.key, r.key)}
              onCellClick={onCellClick}
              cellTone={(_r, g, _c, v) => (g.key === "merma" && v >= 5 ? "text-red-600 dark:text-red-400 font-bold" : undefined)}
              extraColumn={{
                label: "Saldos",
                prevLabel: `Ant: ${formatInteger(alm.stockInicial)}`,
                render: (r) => formatInteger(saldo(alm, r.key)),
                className: (r) =>
                  saldo(alm, r.key) < 0 ? "text-red-600 dark:text-red-400 font-bold bg-red-50/60 dark:bg-red-950/30" : undefined,
              }}
            />
            <GroupedGrid
              title="Producción"
              rows={rows}
              groups={PROD_GROUPS(alm.lotes)}
              getValue={(r, g, c) => value(alm.cod, g, c.key, r.key)}
              onCellClick={onCellClick}
              isCellEditable={(_r, g) => g.key !== "peso"}
            />
          </GridCard>
        );
      })}

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Editar valor" subtitle={editing?.titulo} maxWidth="xs">
        {editing && (
          <div className="space-y-4">
            <NumericStepper label="Cantidad" value={editing.valor} onChange={(v) => setEditing({ ...editing, valor: v })} />
            <div className="flex gap-3 pt-2">
              <Button variant="secondary" className="flex-1" onClick={() => setEditing(null)}>
                Cancelar
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  setEdits((e) => ({ ...e, [editing.key]: editing.valor }));
                  setEditing(null);
                  notify.success("Registro guardado");
                }}
              >
                Guardar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
}
