"use client";

import React, { useEffect, useRef, useState } from "react";

/** El eco (onScroll de la barra que se acaba de mover por código) encuentra ambos valores iguales
 * y no hace nada, así que no hay bucle. */
function sync(from: HTMLDivElement | null, to: HTMLDivElement | null) {
  if (from && to && to.scrollLeft !== from.scrollLeft) to.scrollLeft = from.scrollLeft;
}

/**
 * Contenedor con scroll horizontal para tablas anchas. Cuando (y sólo cuando) el contenido
 * desborda, agrega una segunda barra de scroll arriba sincronizada con la de abajo — así no hace
 * falta bajar hasta el final de una lista larga para desplazarse de costado.
 *
 * Expone `data-scrollable` en el contenedor (grupo `group/scroll`) para que una columna fija
 * (`sticky right-0`) pueda mostrar su sombra de separación sólo cuando hay desborde:
 * `group-data-[scrollable=true]/scroll:shadow-[...]` — ver `STICKY_ACTIONS_CELL`.
 */
export function DualScrollTable({ className = "", children }: { className?: string; children: React.ReactNode }) {
  const topRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [scrollWidth, setScrollWidth] = useState(0);
  const [scrollable, setScrollable] = useState(false);

  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    const measure = () => {
      setScrollWidth(body.scrollWidth);
      setScrollable(body.scrollWidth > body.clientWidth + 1);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(body);
    if (body.firstElementChild) ro.observe(body.firstElementChild);
    return () => ro.disconnect();
  }, []);

  // La barra superior se monta recién al detectar desborde — alinearla con la posición actual.
  useEffect(() => {
    if (scrollable) sync(bodyRef.current, topRef.current);
  }, [scrollable]);

  return (
    <div className={`group/scroll ${className}`} data-scrollable={scrollable}>
      {scrollable && (
        <div
          ref={topRef}
          onScroll={() => sync(topRef.current, bodyRef.current)}
          className="overflow-x-auto overflow-y-hidden border-b border-zinc-100 dark:border-zinc-800"
          aria-hidden
        >
          <div style={{ width: scrollWidth, height: 1 }} />
        </div>
      )}
      <div ref={bodyRef} onScroll={() => sync(bodyRef.current, topRef.current)} className="overflow-x-auto">
        {children}
      </div>
    </div>
  );
}

/** El borde izquierdo va como pseudo-elemento, no `border-l`: el preflight de Tailwind pone las
 * tablas en `border-collapse: collapse`, donde el borde pertenece a la grilla y no se desplaza con
 * la celda sticky. */
const STICKY_BASE =
  "sticky right-0 z-[1] bg-white dark:bg-zinc-950 before:content-[''] before:absolute before:inset-y-0 before:left-0 before:w-px before:bg-zinc-200 dark:before:bg-zinc-800 group-data-[scrollable=true]/scroll:shadow-[-8px_0_8px_-8px_rgba(0,0,0,0.18)]";

/** Clases para la celda de acciones fija a la derecha dentro de un `DualScrollTable`. El fondo es
 * opaco (si no, las columnas que pasan por debajo se ven a través) y replica el hover de la fila
 * (`group` en el `<tr>`); la sombra izquierda sólo aparece cuando la tabla desborda. */
export const STICKY_ACTIONS_CELL =
  `${STICKY_BASE} group-hover:bg-zinc-100 dark:group-hover:bg-zinc-900 transition-colors`;

/** Igual que `STICKY_ACTIONS_CELL` pero para el `<th>` del encabezado (sin hover). */
export const STICKY_ACTIONS_HEAD = STICKY_BASE;
