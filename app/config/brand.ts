/**
 * Per-project identity. Everything the shell (sidebar, login, header) shows about "who this
 * app is" comes from here — change these values, the colors in globals.css' BRAND block and
 * public/logo.svg, and the template is yours.
 */
export const brand = {
  /** Short name: sidebar title, browser tab, PWA name. */
  name: "MI-APP",
  /** One line under the name on the login screen. */
  tagline: "Ingresa tus credenciales para acceder al sistema",
  /** Login heading. */
  welcome: "Bienvenido a MI-APP",
  /** Square logo, ~64px source. */
  logo: "/logo.svg",
  /** Sidebar/login footer. Set to null to hide the block. */
  developedBy: "Innovacion Tecnologica AVR" as string | null,
  /** Small print under the login footer. */
  company: "Grupo Rolón" as string | null,
} as const;
