"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SearchIcon from "@mui/icons-material/Search";
import { PageContainer } from "@/app/components/ui/PageContainer";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { Button } from "@/app/components/ui/Button";
import { Badge } from "@/app/components/ui/Badge";
import { TableContainer, Table, THead, TBody, TR, TH, TD } from "@/app/components/ui/Table";
import { LoadingState, ErrorState } from "@/app/components/ui/States";
import { EmptyState } from "@/app/components/ui/EmptyState";
import { MultiGroupFilterDropdown, toggleFilterValue } from "@/app/components/ui/MultiGroupFilterDropdown";
import { FilterDateInput } from "@/app/components/ui/FilterDateInput";
import { confirmDialog } from "@/app/components/ui/ConfirmDialog";
import { notify } from "@/app/components/ui/Notifier";
import { formatDate } from "@/app/lib/utils/date-format";
import { formatInteger, formatMoney } from "@/app/lib/utils/number-format";
import { RegistroFormModal } from "./RegistroFormModal";
import { SUCURSALES, registrosApi, type Estado, type Registro } from "./data";

/**
 * Reference list screen. Copy its structure for every CRUD page:
 *   PageHeader (Actualizar secondary + primary "Nuevo") → filter toolbar → table card
 *   loading / error / empty states → row actions as ghost icon buttons → delete via confirmDialog
 *   (tone danger) + notify → mobile FAB for the primary action → form in a Modal.
 */
const ESTADO_BADGE: Record<Estado, "success" | "warning" | "danger"> = {
  ACTIVO: "success",
  PENDIENTE: "warning",
  ANULADO: "danger",
};

/** Small controls for a toolbar row (h ≈ 31px, text-xs) — matches FilterDateInput and the filter dropdown. */
const toolbarInputCls =
  "text-xs border border-zinc-200 dark:border-zinc-700 rounded-lg pl-7 pr-2.5 py-1.5 bg-white dark:bg-zinc-950 h-[31px] w-full sm:w-56 outline-none hover:border-brand-300 focus:border-brand-400 focus:ring-1 focus:ring-brand-400";

export default function EjemploPage() {
  const [rows, setRows] = useState<Registro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [desde, setDesde] = useState("");
  const [sucursales, setSucursales] = useState<string[]>([]);
  const [estados, setEstados] = useState<string[]>([]);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Registro | null>(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setRows(await registrosApi.list());
    } catch (err: any) {
      setError(err?.message || "No se pudieron cargar los registros.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const visibles = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter(
      (r) =>
        (!q || r.cliente.toLowerCase().includes(q)) &&
        (!desde || r.fecha >= desde) &&
        (sucursales.length === 0 || sucursales.includes(r.sucursal)) &&
        (estados.length === 0 || estados.includes(r.estado)),
    );
  }, [rows, search, desde, sucursales, estados]);

  const abrirNuevo = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const abrirEditar = (r: Registro) => {
    setEditing(r);
    setFormOpen(true);
  };

  const eliminar = async (r: Registro) => {
    if (
      !(await confirmDialog({
        title: "Eliminar registro",
        message: `¿Eliminar el registro de ${r.cliente} por ${formatMoney(r.monto)}?\nEsta acción no se puede deshacer.`,
        tone: "danger",
        confirmText: "Eliminar",
      }))
    )
      return;
    try {
      await registrosApi.remove(r.id);
      setRows((prev) => prev.filter((x) => x.id !== r.id));
      notify.success("Registro eliminado");
    } catch (err: any) {
      notify.error(err?.message || "No se pudo eliminar el registro.");
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Registros"
        description="Ejemplo de pantalla de listado: filtros, tabla, acciones por fila y formulario en modal."
        actions={
          <>
            <Button variant="secondary" size="sm" onClick={cargar} disabled={loading} startIcon={<RefreshIcon sx={{ fontSize: 18 }} />}>
              <span className="hidden sm:inline">Actualizar</span>
            </Button>
            <Button variant="primary" size="sm" onClick={abrirNuevo} startIcon={<AddIcon sx={{ fontSize: 18 }} />} className="hidden sm:inline-flex">
              Nuevo registro
            </Button>
          </>
        }
      />

      {/* Filter toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:w-auto">
          <SearchIcon sx={{ fontSize: 15 }} className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar cliente…"
            className={toolbarInputCls}
          />
        </div>
        <FilterDateInput value={desde} onChange={setDesde} />
        <MultiGroupFilterDropdown
          allLabel="Todos los registros"
          onClear={() => {
            setSucursales([]);
            setEstados([]);
          }}
          groups={[
            {
              key: "estado",
              title: "Estado",
              options: [
                { value: "ACTIVO", label: "Activo" },
                { value: "PENDIENTE", label: "Pendiente" },
                { value: "ANULADO", label: "Anulado" },
              ],
              selected: estados,
              onToggle: (v) => setEstados((s) => toggleFilterValue(s, v)),
            },
            {
              key: "sucursal",
              title: "Sucursal",
              options: SUCURSALES.map((s) => ({ value: s, label: s })),
              selected: sucursales,
              onToggle: (v) => setSucursales((s) => toggleFilterValue(s, v)),
            },
          ]}
        />
        {!loading && (
          <span className="text-2xs text-zinc-400 dark:text-zinc-500 sm:ml-auto">
            {formatInteger(visibles.length)} de {formatInteger(rows.length)}
          </span>
        )}
      </div>

      {loading ? (
        <LoadingState label="Cargando registros…" />
      ) : error ? (
        <ErrorState message={error} onRetry={cargar} />
      ) : visibles.length === 0 ? (
        <EmptyState
          title={rows.length === 0 ? "Sin registros" : "Ningún registro coincide con los filtros"}
          description={rows.length === 0 ? "Creá el primero con «Nuevo registro»." : "Probá quitando algún filtro."}
          action={
            rows.length === 0 ? (
              <Button size="sm" onClick={abrirNuevo} startIcon={<AddIcon sx={{ fontSize: 18 }} />}>
                Nuevo registro
              </Button>
            ) : undefined
          }
        />
      ) : (
        <TableContainer>
          <Table>
            <THead sticky>
              <TR>
                <TH>Fecha</TH>
                <TH>Cliente</TH>
                <TH className="hidden md:table-cell">Sucursal</TH>
                <TH numeric className="hidden sm:table-cell">Cantidad</TH>
                <TH numeric>Monto</TH>
                <TH>Estado</TH>
                <TH align="right">Acciones</TH>
              </TR>
            </THead>
            <TBody>
              {visibles.map((r) => (
                <TR key={r.id}>
                  <TD className="whitespace-nowrap">{formatDate(`${r.fecha}T00:00:00`)}</TD>
                  <TD className="font-semibold text-zinc-900 dark:text-zinc-50">{r.cliente}</TD>
                  <TD className="hidden md:table-cell">{r.sucursal}</TD>
                  <TD numeric className="hidden sm:table-cell">{formatInteger(r.cantidad)}</TD>
                  <TD numeric>{formatMoney(r.monto)}</TD>
                  <TD>
                    <Badge variant={ESTADO_BADGE[r.estado]}>{r.estado}</Badge>
                  </TD>
                  <TD align="right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon-sm" title="Editar" aria-label="Editar" onClick={() => abrirEditar(r)}>
                        <EditIcon sx={{ fontSize: 18 }} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        title="Eliminar"
                        aria-label="Eliminar"
                        className="hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                        onClick={() => eliminar(r)}
                      >
                        <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                      </Button>
                    </div>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </TableContainer>
      )}

      {/* Mobile FAB for the primary action (the header button hides under sm) */}
      <div className="sm:hidden fixed bottom-6 right-6 z-20">
        <button
          onClick={abrirNuevo}
          className="h-14 px-6 rounded-full bg-primary text-white shadow-xl shadow-brand-500/30 flex items-center justify-center gap-2 hover:bg-primary-hover active:scale-95 transition-all"
        >
          <AddIcon sx={{ fontSize: 24 }} />
          <span className="font-bold text-sm">Nuevo</span>
        </button>
      </div>

      <RegistroFormModal open={formOpen} onClose={() => setFormOpen(false)} onSaved={cargar} registro={editing} />
    </PageContainer>
  );
}
