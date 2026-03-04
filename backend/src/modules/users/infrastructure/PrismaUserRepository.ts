// infrastructure/PrismaUserRepository.ts
import prisma from "../../../shared/infrastructure/persistence/prisma";
import { UserRepository } from "../domain/UserRepository";
import { User } from "../domain/User"; // <--- Importas TU clase de dominio

export class PrismaUserRepository implements UserRepository {
  
  async findByEmail(email: string): Promise<User | null> {
    const userData = await prisma.user.findUnique({
      where: { email },
      include: { roles: { include: { role: true } } }
    });

    if (!userData) return null;

    // EL MAPEO: Convertimos el modelo de Prisma a tu Entidad de Dominio
    return new User(
      userData.id,
      userData.email,
      userData.password,
      userData.companyId ?? null,
      userData.roles.map((ur) => ur.role.name),
      userData.createdAt,
      userData.updatedAt
    );
  }

  async create(data: {
    email: string;
    password: string;
    roleIds: string[];
    companyId?: string | null;
  }): Promise<User> {
    const newUser = await prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        companyId: data.companyId ?? null,
        roles: {
          create: data.roleIds.map((roleId) => ({ roleId }))
        }
      },
      include: { roles: { include: { role: true } } }
    });

    return new User(
      newUser.id,
      newUser.email,
      newUser.password,
      newUser.companyId ?? null,
      newUser.roles.map((ur) => ur.role.name),
      newUser.createdAt,
      newUser.updatedAt
    );
  }
}
