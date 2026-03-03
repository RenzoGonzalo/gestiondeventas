"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaRoleRepository = void 0;
const prisma_1 = __importDefault(require("../../../shared/infrastructure/persistence/prisma"));
const Role_1 = require("../domain/Role");
class PrismaRoleRepository {
    async findByName(name) {
        const roleData = await prisma_1.default.role.findUnique({
            where: { name }
        });
        if (!roleData)
            return null;
        return new Role_1.Role(roleData.id, roleData.name);
    }
}
exports.PrismaRoleRepository = PrismaRoleRepository;
