"use client";

import React from "react";
import { LoadingState } from "./States";

interface SpinnerProps {
  className?: string;
  wrapperClassName?: string;
}

/** Bare spinner (no label). Prefer <LoadingState label="Cargando …" /> for a section. */
export function Spinner({ wrapperClassName = "" }: SpinnerProps) {
  return <LoadingState label={null} className={wrapperClassName} />;
}