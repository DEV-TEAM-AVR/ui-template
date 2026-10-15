"use client";

import React, { useCallback, useMemo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import SendIcon from "@mui/icons-material/Send";
import { PageContainer } from "@/app/components/ui/PageContainer";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Badge } from "@/app/components/ui/Badge";
import { Alert } from "@/app/components/ui/Alert";
import { Input } from "@/app/components/ui/Input";
import { Select } from "@/app/components/ui/Select";
import { Combobox } from "@/app/components/ui/Combobox";
import { FieldLabel } from "@/app/components/ui/FieldLabel";
import { NumericStepper } from "@/app/components/ui/NumericStepper";
import { FilterDateInput } from "@/app/components/ui/FilterDateInput";
import { SegmentedControl } from "@/app/components/ui/SegmentedControl";
import { ToggleChip } from "@/app/components/ui/ToggleChip";
import { MultiGroupFilterDropdown, toggleFilterValue } from "@/app/components/ui/MultiGroupFilterDropdown";
import { Modal } from "@/app/components/ui/Modal";
import { confirmDialog } from "@/app/components/ui/ConfirmDialog";
import { notify } from "@/app/components/ui/Notifier";
import { TableContainer, Table, THead, TBody, TFoot, TR, TH, TD, TableMessageRow } from "@/app/components/ui/Table";
import { GridCard } from "@/app/components/ui/GridCard";
import { GroupedGrid } from "@/app/components/ui/GroupedGrid";
import { DualScrollTable, STICKY_ACTIONS_CELL, STICKY_ACTIONS_HEAD } from "@/app/components/ui/DualScrollTable";
import {
  ExcelColumnFilter,
  cellKey,
  compareCells,
  matchesColumnFilter,
  type ColumnFilterState,
  type SortDir,
} from "@/app/components/ui/ExcelColumnFilter";
import { LoadingState, ErrorState } from "@/app/components/ui/States";
import { EmptyState } from "@/app/components/ui/EmptyState";
import { Skeleton } from "@/app/components/ui/Skeleton";
import { TableSkeleton } from "@/app/components/ui/TableSkeleton";
import { CardSkeleton } from "@/app/components/ui/CardSkeleton";
import { StatCard } from "@/app/components/ui/StatCard";
import { StepProgressBar } from "@/app/components/ui/StepProgressBar";
import { FullscreenChart } from "@/app/components/ui/FullscreenChart";
import { ImageLightbox } from "@/app/components/ui/ImageLightbox";
import { text } from "@/app/components/ui/typography";
import { brand } from "@/app/config/brand";
import { formatInteger, formatMoney, formatNumber, formatPercent } from "@/app/lib/utils/number-format";
import { formatDate, formatDateTime } from "@/app/lib/utils/date-format";

/**
 * Living catalog of the design system. Every primitive appears here with its variants; when you
 * add or change one, update this page. Sections are anchors (#buttons, #fields…).
 */
function Section({ id, title, children, note }: { id: string; title: string; note?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-6">
      <Card className="p-5 space-y-4">
        <div>
          <h2 className={text.section}>{title}</h2>
          {note && <p className={`${text.muted} mt-0.5`}>{note}</p>}
        </div>
        {children}
      </Card>
    </section>
  );
}

const SECTIONS = [
  ["colores", "Colores"],
  ["texto", "Texto"],
  ["botones", "Botones"],
  ["campos", "Campos"],
  ["selectores", "Selectores y filtros"],
  ["feedback", "Alertas y feedback"],
  ["modales", "Modales"],
  ["badges", "Badges"],
  ["tablas", "Tablas"],
  ["estados", "Estados"],
  ["datos", "KPIs y progreso"],
  ["formato", "Formato de números y fechas"],
] as const;

const BRAND_STEPS = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"];
const brandBg: Record<string, string> = {
  "50": "bg-brand-50", "100": "bg-brand-100", "200": "bg-brand-200", "300": "bg-brand-300", "400": "bg-brand-400",
  "500": "bg-brand-500", "600": "bg-brand-600", "700": "bg-brand-700", "800": "bg-brand-800", "900": "bg-brand-900", "950": "bg-brand-950",
};

// Fixed, so server and client render the same text (a live `new Date()` breaks hydration).
const SAMPLE_DATE = new Date(2026, 9, 15, 14, 5, 9);

type Prod = { codigo: string; nombre: string; stock: number; precio: number };
const PRODUCTOS: Prod[] = [
  { codigo: "A-001", nombre: "Caja chica", stock: 120, precio: 12.5 },
  { codigo: "A-002", nombre: "Caja grande", stock: 45, precio: 22 },
  { codigo: "B-010", nombre: "Bolsa", stock: 0, precio: 1.2 },
  { codigo: "B-011", nombre: "Bolsa reforzada", stock: 310, precio: 2.75 },
  { codigo: "C-100", nombre: "Etiqueta", stock: 5000, precio: 0.05 },
];
type ColKey = keyof Prod;
const COLS: { key: ColKey; label: string; type: "text" | "number"; fmt: (p: Prod) => string }[] = [
  { key: "codigo", label: "Código", type: "text", fmt: (p) => p.codigo },
  { key: "nombre", label: "Producto", type: "text", fmt: (p) => p.nombre },
  { key: "stock", label: "Stock", type: "number", fmt: (p) => formatInteger(p.stock) },
  { key: "precio", label: "Precio", type: "number", fmt: (p) => formatMoney(p.precio) },
];

export default function UiKitPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalWide, setModalWide] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [seg, setSeg] = useState<"tabla" | "grafico" | "mapa">("tabla");
  const [segXs, setSegXs] = useState<"semana" | "mes">("semana");
  const [chip, setChip] = useState(true);
  const [estados, setEstados] = useState<string[]>([]);
  const [regiones, setRegiones] = useState<string[]>([]);
  const [fecha, setFecha] = useState("");
  const [cantidad, setCantidad] = useState(12);
  const [cliente, setCliente] = useState("");
  const [sel, setSel] = useState("");
  const [selectedRow, setSelectedRow] = useState<string | null>("A-002");

  // ExcelColumnFilter demo state
  const [filters, setFilters] = useState<Partial<Record<ColKey, ColumnFilterState>>>({});
  const [sort, setSort] = useState<{ key: ColKey; dir: SortDir } | null>(null);
  const filtered = useMemo(() => {
    const rows = PRODUCTOS.filter((p) => COLS.every((c) => matchesColumnFilter(p[c.key], cellKey(p[c.key], c.fmt(p)), filters[c.key])));
    if (sort) {
      const col = COLS.find((c) => c.key === sort.key)!;
      rows.sort((a, b) => compareCells(a[sort.key], b[sort.key], col.type, sort.dir));
    }
    return rows;
  }, [filters, sort]);
  const distinct = useCallback(
    (key: ColKey) => () => {
      const col = COLS.find((c) => c.key === key)!;
      return [...new Set(PRODUCTOS.map((p) => cellKey(p[key], col.fmt(p))))].sort();
    },
    [],
  );

  return (
    <PageContainer>
      <PageHeader title="UI Kit" description="Catálogo vivo del sistema de diseño. Todo lo que ves acá es un componente reutilizable." />

      <nav className="flex flex-wrap gap-1.5">
        {SECTIONS.map(([id, label]) => (
          <a
            key={id}
            href={`#${id}`}
            className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-300 hover:border-brand-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
          >
            {label}
          </a>
        ))}
      </nav>

      <Section id="colores" title="Colores" note="La marca es una sola paleta `brand-*` (globals.css → bloque BRAND). Neutros siempre zinc.">
        <div className="flex flex-wrap gap-1.5">
          {BRAND_STEPS.map((s) => (
            <div key={s} className="flex flex-col items-center gap-1">
              <div className={`h-10 w-12 rounded-lg border border-zinc-200 dark:border-zinc-800 ${brandBg[s]}`} />
              <span className={text.hint}>brand-{s}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          {[
            ["bg-primary", "primary"],
            ["bg-danger", "danger"],
            ["bg-warning", "warning"],
            ["bg-accent", "accent"],
          ].map(([cls, name]) => (
            <div key={name} className="flex items-center gap-2">
              <div className={`h-6 w-6 rounded-md ${cls}`} />
              <span className={text.code}>{name}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 text-xs">
          <span className="rounded-control border border-zinc-300 dark:border-zinc-700 px-3 py-2">rounded-control (12px)</span>
          <span className="rounded-card border border-zinc-300 dark:border-zinc-700 px-3 py-2">rounded-card (16px)</span>
          <span className="rounded-dialog border border-zinc-300 dark:border-zinc-700 px-3 py-2">rounded-dialog (24px)</span>
        </div>
      </Section>

      <Section id="texto" title="Texto" note="Roles de `text` (components/ui/typography.ts). Escala chica: text-2xs 11 · 3xs 10 · 4xs 9 · 5xs 8 px.">
        <div className="space-y-2">
          {(Object.keys(text) as (keyof typeof text)[]).map((k) => (
            <div key={k} className="flex items-baseline gap-4">
              <span className={`${text.code} w-20 shrink-0`}>text.{k}</span>
              <span className={text[k]}>{k === "number" ? formatMoney(1234567.5) : "El veloz murciélago hindú"}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section id="botones" title="Botones" note="Elegí por intención: primary (1 por área) · secondary · ghost · danger · accent (sistemas externos).">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="primary" startIcon={<AddIcon sx={{ fontSize: 18 }} />}>Registrar</Button>
          <Button variant="secondary" startIcon={<DownloadIcon sx={{ fontSize: 18 }} />}>Exportar</Button>
          <Button variant="ghost">Ver detalle</Button>
          <Button variant="danger">Eliminar</Button>
          <Button variant="accent" startIcon={<SendIcon sx={{ fontSize: 18 }} />}>Registrar Factura</Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button loading>Guardando</Button>
          <Button disabled>Deshabilitado</Button>
          <Button variant="ghost" size="icon" aria-label="Editar"><EditIcon sx={{ fontSize: 18 }} /></Button>
          <Button variant="ghost" size="icon-sm" aria-label="Editar"><EditIcon sx={{ fontSize: 16 }} /></Button>
        </div>
      </Section>

      <Section id="campos" title="Campos" note="Etiqueta siempre arriba (FieldLabel: 10px, uppercase). Error debajo en rojo con ícono.">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input label="Nombre" placeholder="Ej: Juan Pérez" required />
          <Input label="Correo" type="email" error="Email inválido." defaultValue="juan@" />
          <Input label="Contraseña" type="password" helperText="Mínimo 6 caracteres" />
          <Input label="Fecha" type="date" defaultValue="2026-10-15" />
          <Select
            label="Sucursal"
            options={[{ value: "N", label: "Norte" }, { value: "S", label: "Sur" }]}
            value={sel}
            onChange={(e) => setSel(e.target.value as string)}
          />
          <Combobox
            label="Cliente (buscable)"
            options={["Distribuidora Andina", "Comercial El Sol", "Mercado Central"].map((c) => ({ value: c, label: c }))}
            value={cliente}
            onChange={setCliente}
          />
          <NumericStepper label="Cantidad" value={cantidad} onChange={setCantidad} step={6} />
          <Input label="Solo lectura" value="REF-0042" readOnly />
          <div>
            <FieldLabel>Fecha (filtro compacto)</FieldLabel>
            <FilterDateInput value={fecha} onChange={setFecha} />
          </div>
        </div>
      </Section>

      <Section id="selectores" title="Selectores y filtros" note="SegmentedControl = cambiar de vista; ToggleChip = incluir/excluir; MultiGroupFilterDropdown = filtros de lista.">
        <div className="flex flex-wrap items-center gap-3">
          <SegmentedControl
            value={seg}
            onChange={setSeg}
            options={[{ value: "tabla", label: "Tabla" }, { value: "grafico", label: "Gráfico" }, { value: "mapa", label: "Mapa" }]}
          />
          <SegmentedControl size="xs" value={segXs} onChange={setSegXs} options={[{ value: "semana", label: "Semana" }, { value: "mes", label: "Mes" }]} />
          <ToggleChip checked={chip} onChange={setChip}>Inactivas</ToggleChip>
          <MultiGroupFilterDropdown
            allLabel="Todas las sucursales"
            onClear={() => { setEstados([]); setRegiones([]); }}
            groups={[
              { key: "estado", title: "Estado", options: [{ value: "A", label: "Activas" }, { value: "S", label: "Suspendidas" }], selected: estados, onToggle: (v) => setEstados((s) => toggleFilterValue(s, v)) },
              {
                key: "region", title: "Región", searchable: true,
                options: ["Andina", "Valles", "Llanos", "Chaco", "Amazonía"].map((r) => ({ value: r, label: r })),
                selected: regiones, onToggle: (v) => setRegiones((s) => toggleFilterValue(s, v)),
              },
            ]}
          />
        </div>
      </Section>

      <Section id="feedback" title="Alertas y feedback" note="Alert = mensaje fijo en el layout · notify = toast tras una acción · confirmDialog = preguntar antes de actuar. Nunca alert()/confirm().">
        <div className="grid gap-2">
          <Alert tone="info">La sincronización corre cada 15 minutos.</Alert>
          <Alert tone="success" title="Período conciliado">Todos los movimientos coinciden.</Alert>
          <Alert tone="warning" title="Semana cerrada" onClose={() => {}}>Los registros ya no se pueden editar.</Alert>
          <Alert tone="danger" action={<Button size="sm" variant="secondary">Reintentar</Button>}>No se pudo guardar el registro.</Alert>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" onClick={() => notify.success("Pago registrado")}>notify.success</Button>
          <Button variant="secondary" size="sm" onClick={() => notify.error("No se pudo conectar con el servidor")}>notify.error</Button>
          <Button variant="secondary" size="sm" onClick={() => notify.info("Exportación en curso…")}>notify.info</Button>
          <Button variant="secondary" size="sm" onClick={async () => { if (await confirmDialog({ message: "¿Aprobar el cierre de la semana?", confirmText: "Aprobar" })) notify.success("Aprobado"); }}>confirm primary</Button>
          <Button variant="secondary" size="sm" onClick={async () => { await confirmDialog({ message: "Esto reescribirá los saldos de todo el mes.", tone: "warning", confirmText: "Recalcular" }); }}>confirm warning</Button>
          <Button variant="danger" size="sm" onClick={async () => { if (await confirmDialog({ title: "Eliminar pago", message: `¿Eliminar el pago de ${formatMoney(1250)}?`, tone: "danger", confirmText: "Eliminar" })) notify.success("Eliminado"); }}>confirm danger</Button>
        </div>
      </Section>

      <Section id="modales" title="Modales" note="En mobile se abren como bottom-sheet. Pie: Cancelar (secondary) + acción (primary), ambos flex-1.">
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => { setModalWide(false); setModalOpen(true); }}>Abrir modal (sm)</Button>
          <Button variant="secondary" onClick={() => { setModalWide(true); setModalOpen(true); }}>Abrir modal ancho (5xl)</Button>
          <Button variant="ghost" onClick={() => setLightbox(brand.logo)}>Abrir lightbox</Button>
        </div>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Registrar pago"
          subtitle="Cliente: Comercial El Sol · Factura 0042"
          maxWidth={modalWide ? "5xl" : "sm"}
          disableBackdropClose
        >
          <div className="space-y-4">
            <Input label="Monto" type="number" required />
            <Input label="Observaciones" multiline minRows={2} />
            <div className="flex gap-3 pt-2">
              <Button variant="secondary" className="flex-1" onClick={() => setModalOpen(false)}>Cancelar</Button>
              <Button className="flex-1" onClick={() => { setModalOpen(false); notify.success("Pago registrado"); }}>Registrar</Button>
            </div>
          </div>
        </Modal>
        <ImageLightbox url={lightbox} onClose={() => setLightbox(null)} />
      </Section>

      <Section id="badges" title="Badges">
        <div className="flex flex-wrap gap-2">
          <Badge>Borrador</Badge>
          <Badge variant="success">Activo</Badge>
          <Badge variant="warning">Pendiente</Badge>
          <Badge variant="danger">Anulado</Badge>
          <Badge variant="info">Sincronizado</Badge>
        </div>
      </Section>

      <Section id="tablas" title="Tablas" note="normal = listas CRUD · compact = reportes. Números con `numeric`, fila total con `total`, filtro tipo Excel en el encabezado.">
        <TableContainer>
          <Table density="compact">
            <THead>
              <TR>
                {COLS.map((c) => (
                  <TH key={c.key} numeric={c.type === "number"}>
                    <span className="inline-flex items-center gap-1">
                      {c.label}
                      <ExcelColumnFilter
                        label={c.label}
                        type={c.type}
                        getDistinct={distinct(c.key)}
                        filter={filters[c.key]}
                        onFilterChange={(f) => setFilters((prev) => ({ ...prev, [c.key]: f }))}
                        sortDir={sort?.key === c.key ? sort.dir : null}
                        onSortChange={(dir) => setSort(dir ? { key: c.key, dir } : null)}
                      />
                    </span>
                  </TH>
                ))}
              </TR>
            </THead>
            <TBody>
              {filtered.length === 0 && <TableMessageRow colSpan={COLS.length}>Sin resultados</TableMessageRow>}
              {filtered.map((p) => (
                <TR key={p.codigo} selected={selectedRow === p.codigo} onClick={() => setSelectedRow(p.codigo)}>
                  <TD className={text.code}>{p.codigo}</TD>
                  <TD>{p.nombre}</TD>
                  <TD numeric className={p.stock === 0 ? "text-red-600 dark:text-red-400 font-bold" : ""}>{formatInteger(p.stock)}</TD>
                  <TD numeric>{formatMoney(p.precio)}</TD>
                </TR>
              ))}
            </TBody>
            <TFoot>
              <TR total>
                <TD colSpan={2}>Total</TD>
                <TD numeric>{formatInteger(filtered.reduce((s, p) => s + p.stock, 0))}</TD>
                <TD numeric>—</TD>
              </TR>
            </TFoot>
          </Table>
        </TableContainer>

        <p className={text.muted}>Tabla ancha: DualScrollTable agrega una barra de scroll arriba y fija la columna de acciones.</p>
        <div className="rounded-card border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden">
          <DualScrollTable>
            <Table density="compact" className="min-w-[1100px]">
              <THead>
                <TR>
                  {Array.from({ length: 10 }, (_, i) => <TH key={i} numeric>Mes {i + 1}</TH>)}
                  <TH className={STICKY_ACTIONS_HEAD}>Acciones</TH>
                </TR>
              </THead>
              <TBody>
                {[1, 2, 3].map((r) => (
                  <TR key={r} className="group">
                    {Array.from({ length: 10 }, (_, i) => <TD key={i} numeric>{formatNumber(r * 1000 + i * 37.5)}</TD>)}
                    <TD className={STICKY_ACTIONS_CELL}>
                      <Button variant="ghost" size="icon-sm" aria-label="Editar"><EditIcon sx={{ fontSize: 16 }} /></Button>
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </DualScrollTable>
        </div>

        <p className={text.muted}>
          Grilla de carga por período: GridCard (barra negra) + GroupedGrid (bandas de color por grupo, TOTAL, SALDOS, pie). Ejemplo
          completo en <a href="/ejemplo/semanal" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">/ejemplo/semanal</a>.
        </p>
        <GridCard icon={<EditIcon sx={{ fontSize: 18 }} />} title="Almacén Norte" meta="2 lotes" chips={["Lote 1 · Sem. 10", "Lote 2 · Sem. 13"]}>
          <GroupedGrid
            title="Stock"
            rows={["Lun", "Mar", "Mié"].map((d, i) => ({ key: d, label: d, sublabel: 13 + i }))}
            groups={[
              { key: "merma", label: "Merma", tone: "red", columns: [{ key: "l1", label: "Lote 1" }, { key: "l2", label: "Lote 2" }] },
              { key: "ing", label: "Ingresos", tone: "positive", columns: [{ key: "l1", label: "Lote 1" }, { key: "l2", label: "Lote 2" }] },
              { key: "prod", label: "Producción", tone: "blue", columns: [{ key: "l1", label: "Lote 1" }, { key: "l2", label: "Lote 2" }] },
            ]}
            getValue={(r, g, c) => (r.key === "Mié" && g.key === "ing" ? null : ((r.key.length * 7 + g.key.length * 13 + c.key.length * 3) % 40) + (g.key === "prod" ? 400 : 0))}
            onCellClick={(r, g, c) => notify.info(`${g.label} · ${c.key} · ${r.key}`)}
            extraColumn={{ label: "Saldos", prevLabel: "Ant: 1,200", render: (r) => formatInteger(1200 - r.key.length * 10) }}
          />
        </GridCard>
      </Section>

      <Section id="estados" title="Estados" note="Toda zona que carga datos muestra loading → error (con Reintentar) → vacío → contenido.">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-card border border-dashed border-zinc-200 dark:border-zinc-800"><LoadingState label="Cargando ventas…" size="sm" /></div>
          <div className="rounded-card border border-dashed border-zinc-200 dark:border-zinc-800"><ErrorState message="No se pudieron cargar las ventas." onRetry={() => notify.info("Reintentando…")} size="sm" /></div>
          <div className="rounded-card border border-dashed border-zinc-200 dark:border-zinc-800"><EmptyState size="sm" title="Sin ventas" description="No hay ventas en el período." /></div>
        </div>
        <EmptyState title="Sin registros" description="Versión de página completa (size md)." action={<Button size="sm">Crear el primero</Button>} />
        <div className="space-y-2">
          <Skeleton className="w-1/2" />
          <Skeleton className="w-1/3" />
        </div>
        <TableSkeleton rows={3} columns={4} />
        <CardSkeleton count={3} />
      </Section>

      <Section id="datos" title="KPIs y progreso">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Ventas" value={formatMoney(48210.5)} delta={4.1} deltaLabel="+4.1% vs anterior" />
          <StatCard label="Merma" value={formatPercent(2.3)} delta={0.4} deltaLabel="+0.4 pts" goodWhen="down" />
          <StatCard label="Pedidos" value={formatInteger(1240)} unit="u" />
          <StatCard label="Clientes" value="86" deltaLabel="Sin cambios" />
        </div>
        <StepProgressBar done={3} total={8} partial={0.4} message="Recalculando saldos…" current="Sucursal Norte" unit="sucursales" errorCount={1} />
        <FullscreenChart className="w-full h-48 mt-2" header={<h3 className={text.section}>Gráfico (con pantalla completa)</h3>}>
          <div className="h-full w-full flex items-end gap-2 p-4 rounded-card bg-zinc-50 dark:bg-zinc-900">
            {[40, 65, 30, 80, 55, 90, 70].map((h, i) => (
              <div key={i} className="flex-1 rounded-t-md bg-brand-500/80" style={{ height: `${h}%` }} />
            ))}
          </div>
        </FullscreenChart>
      </Section>

      <Section id="formato" title="Formato de números y fechas" note="Siempre con lib/utils/number-format y date-format — nunca toLocaleString() (lint).">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
          {[
            ["formatNumber(1234.5)", formatNumber(1234.5)],
            ["formatNumber(1234.5, 0)", formatNumber(1234.5, 0)],
            ["formatInteger(98765)", formatInteger(98765)],
            ["formatMoney(1250)", formatMoney(1250)],
            ["formatPercent(12.345)", formatPercent(12.345)],
            ["formatNumber(null) || \"—\"", formatNumber(null) || "—"],
            ["formatDate(fecha)", formatDate(SAMPLE_DATE)],
            ["formatDateTime(fecha)", formatDateTime(SAMPLE_DATE)],
          ].map(([code, out]) => (
            <div key={code} className="flex justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 py-1">
              <span className={text.code}>{code}</span>
              <span className={`${text.strong} ${text.number}`}>{out}</span>
            </div>
          ))}
        </div>
      </Section>
    </PageContainer>
  );
}
