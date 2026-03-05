"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaProductRepository = void 0;
const prisma_1 = __importDefault(require("../../../shared/infrastructure/persistence/prisma"));
const Product_1 = require("../domain/Product");
const InventoryErrors_1 = require("../domain/InventoryErrors");
class PrismaProductRepository {
    async createWithVariants(input) {
        const category = await prisma_1.default.category.findFirst({
            where: { id: input.categoryId, companyId: input.companyId }
        });
        if (!category)
            throw new InventoryErrors_1.InventoryNotFoundError("Category not found");
        const created = await prisma_1.default.product.create({
            data: {
                companyId: input.companyId,
                categoryId: input.categoryId,
                nombre: input.nombre,
                descripcion: input.descripcion ?? null,
                imagen: input.imagen ?? null,
                activo: input.activo ?? true,
                atributos: (input.atributos ?? []),
                unitType: input.unitType ?? undefined,
                variantes: {
                    create: input.variantes.map((v) => ({
                        companyId: input.companyId,
                        nombre: v.nombre,
                        sku: v.sku,
                        codigoBarras: v.codigoBarras ?? null,
                        atributos: v.atributos,
                        unitType: v.unitType ?? (input.unitType ?? undefined),
                        precioCompra: v.precioCompra,
                        precioVenta: v.precioVenta,
                        stockActual: v.stockActual ?? "0",
                        stockMinimo: v.stockMinimo ?? "5",
                        ubicacion: v.ubicacion ?? null,
                        activo: v.activo ?? true,
                        creadoPor: input.creadoPor
                    }))
                }
            },
            include: { variantes: { select: { id: true } } }
        });
        const product = new Product_1.Product(created.id, created.companyId, created.categoryId, created.nombre, created.descripcion, created.imagen, created.activo, created.atributos, created.unitType, created.createdAt, created.updatedAt);
        return {
            product,
            variantIds: created.variantes.map((v) => v.id)
        };
    }
    async listByCompany(input) {
        const rows = await prisma_1.default.product.findMany({
            where: {
                companyId: input.companyId,
                categoryId: input.categoryId ?? undefined
            },
            orderBy: { nombre: "asc" }
        });
        return rows.map((p) => new Product_1.Product(p.id, p.companyId, p.categoryId, p.nombre, p.descripcion, p.imagen, p.activo, p.atributos, p.unitType, p.createdAt, p.updatedAt));
    }
    async findById(input) {
        const row = await prisma_1.default.product.findFirst({
            where: { id: input.id, companyId: input.companyId }
        });
        if (!row)
            return null;
        return new Product_1.Product(row.id, row.companyId, row.categoryId, row.nombre, row.descripcion, row.imagen, row.activo, row.atributos, row.unitType, row.createdAt, row.updatedAt);
    }
    async update(input) {
        const existing = await prisma_1.default.product.findFirst({
            where: { id: input.id, companyId: input.companyId }
        });
        if (!existing)
            throw new InventoryErrors_1.InventoryNotFoundError("Product not found");
        if (input.categoryId) {
            const category = await prisma_1.default.category.findFirst({
                where: { id: input.categoryId, companyId: input.companyId }
            });
            if (!category)
                throw new InventoryErrors_1.InventoryNotFoundError("Category not found");
        }
        const updated = await prisma_1.default.product.update({
            where: { id: input.id },
            data: {
                nombre: input.nombre ?? undefined,
                descripcion: input.descripcion ?? undefined,
                imagen: input.imagen ?? undefined,
                activo: input.activo ?? undefined,
                atributos: input.atributos === undefined ? undefined : input.atributos,
                unitType: input.unitType ?? undefined,
                categoryId: input.categoryId ?? undefined
            }
        });
        return new Product_1.Product(updated.id, updated.companyId, updated.categoryId, updated.nombre, updated.descripcion, updated.imagen, updated.activo, updated.atributos, updated.unitType, updated.createdAt, updated.updatedAt);
    }
    async delete(input) {
        const existing = await prisma_1.default.product.findFirst({
            where: { id: input.id, companyId: input.companyId }
        });
        if (!existing)
            throw new InventoryErrors_1.InventoryNotFoundError("Product not found");
        await prisma_1.default.product.delete({ where: { id: input.id } });
    }
    async countStockMovementsByProduct(input) {
        return prisma_1.default.stockMovement.count({
            where: {
                companyId: input.companyId,
                variant: { productId: input.productId }
            }
        });
    }
}
exports.PrismaProductRepository = PrismaProductRepository;
