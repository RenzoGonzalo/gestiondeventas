import prisma from "../../../shared/infrastructure/persistence/prisma";
import { RoleRepository } from "../domain/RoleRepository";
import { Role } from "../domain/Role";

export class PrismaRoleRepository implements RoleRepository {
  async findByName(name: string): Promise<Role | null> {
    const roleData = await prisma.role.findUnique({
      where: { name }
    });

    if (!roleData) return null;

    return new Role(roleData.id, roleData.name);
  }
}
