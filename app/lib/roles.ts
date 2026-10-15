/**
 * Role names are uppercase string constants, normalized server-side. An unresolved role is
 * GUEST (no access). Replace these with the project's real roles.
 */
export const ROLES = {
  ADMIN: "ADMINISTRADOR",
  MANAGER: "ENCARGADO",
  WORKER: "OPERADOR",
  GUEST: "GUEST",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES] | string;

/** Display names for the header/user menu. */
export const ROLE_LABELS: Record<string, string> = {
  [ROLES.ADMIN]: "Administrador",
  [ROLES.MANAGER]: "Encargado",
  [ROLES.WORKER]: "Operador",
  [ROLES.GUEST]: "Invitado",
};

export const roleLabel = (role: string) => ROLE_LABELS[role] || role;

/** No allowedRoles list = visible to every signed-in role. */
export function roleIsAllowed(allowedRoles: readonly string[] | undefined, role: string): boolean {
  return !allowedRoles || allowedRoles.includes(role);
}
