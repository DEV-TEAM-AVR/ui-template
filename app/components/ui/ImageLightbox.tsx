"use client";

import React from "react";
import CloseIcon from "@mui/icons-material/Close";

interface ImageLightboxProps {
  /** URL de la imagen a mostrar a pantalla completa; null = cerrado. */
  url: string | null;
  onClose: () => void;
  alt?: string;
}

/** Visor genérico de una imagen a pantalla completa — click afuera, la X o Escape cierran. z-[9999]
 * porque suele abrirse desde adentro de un <Modal> (Dialog de MUI, z-index ~1300). */
export function ImageLightbox({ url, onClose, alt = "" }: ImageLightboxProps) {
  React.useEffect(() => {
    if (!url) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [url, onClose]);

  if (!url) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar"
        className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full
          bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
      >
        <CloseIcon sx={{ fontSize: 22 }} />
      </button>
      <img
        src={url}
        alt={alt}
        className="max-w-full max-h-full object-contain rounded-lg"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
