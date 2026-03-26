export function pickPrimaryRole(roles: string[]) {
  if (roles.includes("SUPER_ADMIN")) return "SUPER_ADMIN";
  if (roles.includes("STORE_ADMIN")) return "STORE_ADMIN";
  if (roles.includes("SELLER")) return "SELLER";
  return roles[0] ?? "";
}
