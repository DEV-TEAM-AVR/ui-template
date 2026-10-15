"use client";

import React, { useEffect, useState } from "react";
import { Modal } from "@/app/components/ui/Modal";
import { Input } from "@/app/components/ui/Input";
import { Select } from "@/app/components/ui/Select";
import { Combobox } from "@/app/components/ui/Combobox";
import { NumericStepper } from "@/app/components/ui/NumericStepper";
import { Button } from "@/app/components/ui/Button";
import { Alert } from "@/app/components/ui/Alert";
import { notify } from "@/app/components/ui/Notifier";
import { CLIENTES, SUCURSALES, registrosApi, type Estado, type Registro } from "./data";

/**
 * The standard create/edit form modal:
 *  - maxWidth "sm", subtitle gives context, disableBackdropClose so a stray click keeps input
 *  - fields stacked with space-y-4; two short fields share a row via grid-cols-2
 *  - per-field errors under the field; a submit/API error as <Alert tone="danger"> on top
 *  - footer: Cancelar (secondary) left, action (primary, loading) right, both flex-1
 *  - success → notify.success + onSaved() + close; the list refreshes itself
 */
type FormState = { fecha: string; cliente: string; sucursal: string; cantidad: number; monto: string; estado: Estado };

const empty = (): FormState => ({
  fecha: new Date().toLocaleDateString("en-CA"),
  cliente: "",
  sucursal: "",
  cantidad: 0,
  monto: "",
  estado: "ACTIVO",
});

export function RegistroFormModal({
  open,
  onClose,
  onSaved,
  registro,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  /** null = create. */
  registro: Registro | null;
}) {
  const [form, setForm] = useState<FormState>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(
      registro
        ? { ...registro, monto: String(registro.monto) }
        : empty(),
    );
    setErrors({});
    setSubmitError(null);
  }, [open, registro]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.cliente) e.cliente = "El cliente es requerido.";
    if (!form.sucursal) e.sucursal = "Elegí una sucursal.";
    if (form.cantidad <= 0) e.cantidad = "La cantidad debe ser mayor a 0.";
    if (!form.monto || Number(form.monto) <= 0) e.monto = "Ingresá un monto válido.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setSubmitError(null);
    try {
      const payload = { ...form, monto: Number(form.monto) };
      if (registro) await registrosApi.update(registro.id, payload);
      else await registrosApi.create(payload);
      notify.success(registro ? "Registro actualizado" : "Registro creado");
      onSaved();
      onClose();
    } catch (err: any) {
      setSubmitError(err?.message || "No se pudo guardar el registro.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={registro ? "Editar registro" : "Nuevo registro"}
      subtitle={registro ? `${registro.cliente} · ${registro.sucursal}` : "Completá los datos del registro"}
      maxWidth="sm"
      disableBackdropClose
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {submitError && <Alert tone="danger">{submitError}</Alert>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Fecha" type="date" required value={form.fecha} onChange={(e) => set("fecha", e.target.value)} />
          <Select
            label="Estado"
            required
            options={[
              { value: "ACTIVO", label: "Activo" },
              { value: "PENDIENTE", label: "Pendiente" },
              { value: "ANULADO", label: "Anulado" },
            ]}
            value={form.estado}
            onChange={(e) => set("estado", e.target.value as Estado)}
          />
        </div>

        <Combobox
          label="Cliente"
          required
          options={CLIENTES.map((c) => ({ value: c, label: c }))}
          value={form.cliente}
          onChange={(v) => set("cliente", v)}
          error={errors.cliente}
        />

        <Select
          label="Sucursal"
          required
          options={SUCURSALES.map((s) => ({ value: s, label: s }))}
          value={form.sucursal}
          onChange={(e) => set("sucursal", e.target.value as string)}
          error={errors.sucursal}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumericStepper label="Cantidad" required value={form.cantidad} onChange={(v) => set("cantidad", v)} step={10} error={errors.cantidad} />
          <Input
            label="Monto (Bs)"
            type="number"
            required
            value={form.monto}
            onChange={(e) => set("monto", e.target.value)}
            error={errors.monto}
            helperText="Con IVA incluido"
            step="0.01"
            min={0}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="secondary" className="flex-1" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" className="flex-1" loading={saving}>
            {registro ? "Guardar cambios" : "Registrar"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
