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
        const userData = await prisma_1.default.user.findUnique({
            where: { email },
            include: { role: true }
        });
        if (!userData)
            return null;
        // EL MAPEO: Convertimos el modelo de Prisma a tu Entidad de Dominio
        return new User_1.User(userData.id, userData.email, userData.password, userData.roleId, userData.role.name, userData.companyId ?? null, userData.createdAt, userData.updatedAt);
    }
    async create(data) {
        const newUser = await prisma_1.default.user.create({
            data: {
                email: data.email,
                password: data.password,
                roleId: data.roleId,
                companyId: data.companyId ?? null
            },
            include: { role: true }
        });
        return new User_1.User(newUser.id, newUser.email, newUser.password, newUser.roleId, newUser.role.name, newUser.companyId ?? null, newUser.createdAt, newUser.updatedAt);
    }
}
exports.PrismaUserRepository = PrismaUserRepository;
