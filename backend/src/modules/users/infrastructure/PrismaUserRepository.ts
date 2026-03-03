// infrastructure/PrismaUserRepository.ts
import prisma from "../../../shared/infrastructure/persistence/prisma";
import { UserRepository } from "../domain/UserRepository";
import { User } from "../domain/User"; // <--- Importas TU clase de dominio

export class PrismaUserRepository implements UserRepository {
  
  async findByEmail(email: string): Promise<User | null> {
    const userData = await prisma.user.findUnique({
      where: { email },
      include: { role: true }
    });

    if (!userData) return null;

    // EL MAPEO: Convertimos el modelo de Prisma a tu Entidad de Dominio
    return new User(
      userData.id,
      userData.email,
      userData.password,
      userData.roleId,
      userData.role.name,
      userData.companyId ?? null,
      userData.createdAt,
      userData.updatedAt
    );
  }

  async create(data: {
    email: string;
    password: string;
    roleId: string;
    companyId?: string | null;
  }): Promise<User> {
    const newUser = await prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        roleId: data.roleId,
        companyId: data.companyId ?? null
      },
      include: { role: true }
    });

    return new User(
      newUser.id,
      newUser.email,
      newUser.password,
      newUser.roleId,
      newUser.role.name,
      newUser.companyId ?? null,
      newUser.createdAt,
      newUser.updatedAt
    );
  }
}
