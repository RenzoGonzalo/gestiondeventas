"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaUserRepository = void 0;
// infrastructure/PrismaUserRepository.ts
const prisma_1 = __importDefault(require("../../../shared/infrastructure/persistence/prisma"));
const User_1 = require("../domain/User"); // <--- Importas TU clase de dominio
class PrismaUserRepository {
    async findByEmail(email) {
        const userData = (await prisma_1.default.user.findUnique({
            where: { email },
            include: { roles: { include: { role: true } } }
        }));
        if (!userData)
            return null;
        // EL MAPEO: Convertimos el modelo de Prisma a tu Entidad de Dominio
        return new User_1.User(userData.id, userData.email, userData.nombre, userData.password, userData.companyId ?? null, userData.roles.map((ur) => ur.role.name), userData.createdAt, userData.updatedAt);
    }
    async create(data) {
        const newUser = (await prisma_1.default.user.create({
            data: {
                email: data.email,
                nombre: data.nombre,
                password: data.password,
                companyId: data.companyId ?? null,
                roles: {
                    create: data.roleIds.map((roleId) => ({ roleId }))
                }
            },
            include: { roles: { include: { role: true } } }
        }));
        return new User_1.User(newUser.id, newUser.email, newUser.nombre, newUser.password, newUser.companyId ?? null, newUser.roles.map((ur) => ur.role.name), newUser.createdAt, newUser.updatedAt);
    }
}
exports.PrismaUserRepository = PrismaUserRepository;
