// infrastructure/PrismaUserRepository.ts
import prisma from "../../../shared/infrastructure/persistence/prisma";
import { UserRepository } from "../domain/UserRepository";
import { User } from "../domain/User"; // <--- Importas TU clase de dominio

export class PrismaUserRepository implements UserRepository {
  
  async findByEmail(email: string): Promise<User | null> {
    const userData = (await prisma.user.findUnique({
      where: { email },
      include: { roles: { include: { role: true } } }
    })) as any;

    if (!userData) return null;

    // EL MAPEO: Convertimos el modelo de Prisma a tu Entidad de Dominio
    return new User(
      userData.id,
      userData.email,
      userData.nombre,
      userData.password,
      userData.googleSub ?? null,
      userData.sellerCode ?? null,
      userData.storeAdminWelcomeEmailSentAt ?? null,
      userData.emailVerified,
      userData.emailVerificationTokenHash ?? null,
      userData.emailVerificationTokenExpiresAt ?? null,
      userData.companyId ?? null,
      (userData.roles as any[]).map((ur: any) => ur.role.name),
      userData.createdAt,
      userData.updatedAt
    );
  }

  async findByGoogleSub(googleSub: string): Promise<User | null> {
    const userData = (await prisma.user.findUnique({
      where: { googleSub } as any,
      include: { roles: { include: { role: true } } }
    })) as any;

    if (!userData) return null;

    return new User(
      userData.id,
      userData.email,
      userData.nombre,
      userData.password,
      userData.googleSub ?? null,
      userData.sellerCode ?? null,
      userData.storeAdminWelcomeEmailSentAt ?? null,
      userData.emailVerified,
      userData.emailVerificationTokenHash ?? null,
      userData.emailVerificationTokenExpiresAt ?? null,
      userData.companyId ?? null,
      (userData.roles as any[]).map((ur: any) => ur.role.name),
      userData.createdAt,
      userData.updatedAt
    );
  }

  async findBySellerCode(code: string): Promise<User | null> {
    const userData = (await prisma.user.findUnique({
      where: { sellerCode: code } as any,
      include: { roles: { include: { role: true } } }
    })) as any;

    if (!userData) return null;

    return new User(
      userData.id,
      userData.email,
      userData.nombre,
      userData.password,
      userData.googleSub ?? null,
      userData.sellerCode ?? null,
      userData.storeAdminWelcomeEmailSentAt ?? null,
      userData.emailVerified,
      userData.emailVerificationTokenHash ?? null,
      userData.emailVerificationTokenExpiresAt ?? null,
      userData.companyId ?? null,
      (userData.roles as any[]).map((ur: any) => ur.role.name),
      userData.createdAt,
      userData.updatedAt
    );
  }

  async findByEmailVerificationTokenHash(tokenHash: string): Promise<User | null> {
    const userData = (await prisma.user.findUnique({
      where: { emailVerificationTokenHash: tokenHash } as any,
      include: { roles: { include: { role: true } } },
    })) as any;

    if (!userData) return null;

    return new User(
      userData.id,
      userData.email,
      userData.nombre,
      userData.password,
      userData.googleSub ?? null,
      userData.sellerCode ?? null,
      userData.storeAdminWelcomeEmailSentAt ?? null,
      userData.emailVerified,
      userData.emailVerificationTokenHash ?? null,
      userData.emailVerificationTokenExpiresAt ?? null,
      userData.companyId ?? null,
      (userData.roles as any[]).map((ur: any) => ur.role.name),
      userData.createdAt,
      userData.updatedAt
    );
  }

  async setEmailVerificationToken(userId: string, tokenHash: string, expiresAt: Date): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        emailVerificationTokenHash: tokenHash,
        emailVerificationTokenExpiresAt: expiresAt,
      },
    });
  }

  async markEmailVerified(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        emailVerified: true,
        emailVerificationTokenHash: null,
        emailVerificationTokenExpiresAt: null,
      },
    });
  }

  async markStoreAdminWelcomeEmailSent(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: ({
        storeAdminWelcomeEmailSentAt: new Date()
      } as any)
    });
  }

  async linkGoogleSub(userId: string, googleSub: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        googleSub
      }
    });
  }

  async create(data: {
    email: string;
    nombre: string;
    password: string;
    sellerCode?: string | null;
    roleIds: string[];
    companyId?: string | null;
  }): Promise<User> {
    const newUser = (await prisma.user.create({
      data: ({
        email: data.email,
        nombre: data.nombre,
        password: data.password,
        googleSub: null,
        sellerCode: data.sellerCode ?? null,
        storeAdminWelcomeEmailSentAt: null,
        emailVerified: false,
        emailVerificationTokenHash: null,
        emailVerificationTokenExpiresAt: null,
        companyId: data.companyId ?? null,
        roles: {
          create: data.roleIds.map((roleId) => ({ roleId }))
        }
      } as any),
      include: { roles: { include: { role: true } } }
    })) as any;

    return new User(
      newUser.id,
      newUser.email,
      newUser.nombre,
      newUser.password,
      newUser.googleSub ?? null,
      newUser.sellerCode ?? null,
      newUser.storeAdminWelcomeEmailSentAt ?? null,
      newUser.emailVerified,
      newUser.emailVerificationTokenHash ?? null,
      newUser.emailVerificationTokenExpiresAt ?? null,
      newUser.companyId ?? null,
      (newUser.roles as any[]).map((ur: any) => ur.role.name),
      newUser.createdAt,
      newUser.updatedAt
    );
  }
}
