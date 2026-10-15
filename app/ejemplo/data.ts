/**
 * In-memory stand-in for an API wrapper (app/lib/<feature>.ts in a real project, built on
 * apiClient). Same async shape so the screen code doesn't change when it goes real.
 */
export type Estado = "ACTIVO" | "PENDIENTE" | "ANULADO";

export interface Registro {
  id: string;
  fecha: string; // YYYY-MM-DD
  cliente: string;
  sucursal: string;
  cantidad: number;
  monto: number;
  estado: Estado;
}

export const SUCURSALES = ["Norte", "Centro", "Sur", "Oeste"];
export const CLIENTES = ["Distribuidora Andina", "Comercial El Sol", "Mercado Central", "Tienda La Esquina", "Supermercado Norte"];

let data: Registro[] = Array.from({ length: 14 }, (_, i) => ({
  id: String(i + 1),
  fecha: `2026-10-${String(1 + i).padStart(2, "0")}`,
  cliente: CLIENTES[i % CLIENTES.length],
  sucursal: SUCURSALES[i % SUCURSALES.length],
  cantidad: 20 + ((i * 37) % 180),
  monto: 350 + ((i * 913) % 9000) + 0.5,
  estado: (["ACTIVO", "ACTIVO", "PENDIENTE", "ANULADO"] as Estado[])[i % 4],
}));

const delay = <T,>(v: T, ms = 400) => new Promise<T>((r) => setTimeout(() => r(v), ms));

export const registrosApi = {
  list: () => delay([...data]),
  create: (r: Omit<Registro, "id">) => {
    const nuevo = { ...r, id: String(Date.now()) };
    data = [nuevo, ...data];
    return delay(nuevo);
  },
  update: (id: string, r: Omit<Registro, "id">) => {
    data = data.map((x) => (x.id === id ? { ...r, id } : x));
    return delay({ ...r, id });
  },
  remove: (id: string) => {
    data = data.filter((x) => x.id !== id);
    return delay(undefined);
  },
};
