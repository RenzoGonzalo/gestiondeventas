"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaCategoryRepository = void 0;
const prisma_1 = __importDefault(require("../../../shared/infrastructure/persistence/prisma"));
const Category_1 = require("../domain/Category");
const InventoryErrors_1 = require("../domain/InventoryErrors");
class PrismaCategoryRepository {
    async create(input) {
        const created = await prisma_1.default.category.create({
            data: {
                companyId: input.companyId,
                nombre: input.nombre,
                descripcion: input.descripcion ?? null,
                activo: true
            }
        });
        return new Category_1.Category(created.id, created.companyId, created.nombre, created.descripcion, created.activo, created.createdAt, created.updatedAt);
    }
    async listByCompany(companyId) {
        const rows = await prisma_1.default.category.findMany({
            where: { companyId },
            orderBy: { nombre: "asc" }
        });
        return rows.map((c) => new Category_1.Category(c.id, c.companyId, c.nombre, c.descripcion, c.activo, c.createdAt, c.updatedAt));
    }
    async findById(input) {
        const row = await prisma_1.default.category.findFirst({
            where: { id: input.id, companyId: input.companyId }
        });
        if (!row)
            return null;
        return new Category_1.Category(row.id, row.companyId, row.nombre, row.descripcion, row.activo, row.createdAt, row.updatedAt);
    }
    async update(input) {
        const existing = await prisma_1.default.category.findFirst({
            where: { id: input.id, companyId: input.companyId }
        });
        if (!existing)
            throw new InventoryErrors_1.InventoryNotFoundError("Category not found");
        const updated = await prisma_1.default.category.update({
            where: { id: input.id },
            data: {
                nombre: input.nombre ?? undefined,
                descripcion: input.descripcion ?? undefined,
                activo: input.activo ?? undefined
            }
        });
        return new Category_1.Category(updated.id, updated.companyId, updated.nombre, updated.descripcion, updated.activo, updated.createdAt, updated.updatedAt);
    }
    async delete(input) {
        const existing = await prisma_1.default.category.findFirst({
            where: { id: input.id, companyId: input.companyId }
        });
        if (!existing)
            throw new InventoryErrors_1.InventoryNotFoundError("Category not found");
        await prisma_1.default.category.delete({ where: { id: input.id } });
    }
    async countProducts(input) {
        return prisma_1.default.product.count({
            where: { companyId: input.companyId, categoryId: input.categoryId }
        });
    }
}
exports.PrismaCategoryRepository = PrismaCategoryRepository;
