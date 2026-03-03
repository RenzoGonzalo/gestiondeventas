import { Role } from "./Role";

export interface RoleRepository {
  findByName(name: string): Promise<Role | null>;
}
