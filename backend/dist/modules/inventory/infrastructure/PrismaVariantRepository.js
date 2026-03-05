"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaVariantRepository = void 0;
const prisma_1 = __importDefault(require("../../../shared/infrastructure/persistence/prisma"));
const Variant_1 = require("../domain/Variant");
const InventoryErrors_1 = require("../domain/InventoryErrors");
class PrismaVariantRepository {
    async listByProduct(input) {
        const rows = await prisma_1.default.variant.findMany({
            where: { companyId: input.companyId, productId: input.productId },
            orderBy: { nombre: "asc" }
        });
        return rows.map((v) => this.toDomain(v));
    }
    async create(input) {
        const product = await prisma_1.default.product.findFirst({
            where: { id: input.productId, companyId: input.companyId }
        });
        if (!product)
            throw new InventoryErrors_1.InventoryNotFoundError("Product not found");
        const created = await prisma_1.default.variant.create({
            data: {
                companyId: input.companyId,
                productId: input.productId,
                nombre: input.nombre,
                sku: input.sku,
                codigoBarras: input.codigoBarras ?? null,
                atributos: input.atributos,
                unitType: input.unitType ?? undefined,
                precioCompra: input.precioCompra,
                precioVenta: input.precioVenta,
                stockActual: input.stockActual ?? "0",
                stockMinimo: input.stockMinimo ?? "5",
                ubicacion: input.ubicacion ?? null,
                activo: input.activo ?? true,
                creadoPor: input.creadoPor
            }
        });
        return this.toDomain(created);
    }
    async update(input) {
        const existing = await prisma_1.default.variant.findFirst({
            where: { id: input.id, companyId: input.companyId }
        });
        if (!existing)
            throw new InventoryErrors_1.InventoryNotFoundError("Variant not found");
        const updated = await prisma_1.default.variant.update({
            where: { id: input.id },
            data: {
                nombre: input.nombre ?? undefined,
                sku: input.sku ?? undefined,
                codigoBarras: input.codigoBarras ?? undefined,
                atributos: input.atributos === undefined ? undefined : input.atributos,
                unitType: input.unitType ?? undefined,
                precioCompra: input.precioCompra ?? undefined,
                precioVenta: input.precioVenta ?? undefined,
                stockMinimo: input.stockMinimo ?? undefined,
                ubicacion: input.ubicacion ?? undefined,
                activo: input.activo ?? undefined
            }
        });
        return this.toDomain(updated);
    }
    async delete(input) {
        const existing = await prisma_1.default.variant.findFirst({
            where: { id: input.id, companyId: input.companyId }
        });
        if (!existing)
            throw new InventoryErrors_1.InventoryNotFoundError("Variant not found");
        await prisma_1.default.variant.delete({ where: { id: input.id } });
    }
    async findById(input) {
        const row = await prisma_1.default.variant.findFirst({
            where: { id: input.id, companyId: input.companyId }
        });
        return row ? this.toDomain(row) : null;
    }
    async countStockMovements(input) {
        return prisma_1.default.stockMovement.count({
            where: { companyId: input.companyId, variantId: input.variantId }
        });
    }
    async adjustStock(input) {
        const result = await prisma_1.default.$transaction(async (tx) => {
            const existing = await tx.variant.findFirst({
                where: { id: input.variantId, companyId: input.companyId }
            });
            if (!existing)
                throw new InventoryErrors_1.InventoryNotFoundError("Variant not found");
            const stockAnterior = Number(existing.stockActual.toString());
            const delta = Number(input.cantidad);
            const stockNuevo = stockAnterior + delta;
            const updated = await tx.variant.update({
                where: { id: existing.id },
                data: { stockActual: stockNuevo.toFixed(2) }
            });
            const movement = await tx.stockMovement.create({
                data: {
                    companyId: input.companyId,
                    variantId: existing.id,
                    tipo: "AJUSTE",
                    cantidad: input.cantidad,
                    stockAnterior: stockAnterior.toFixed(2),
                    stockNuevo: stockNuevo.toFixed(2),
                    motivo: input.motivo ?? null,
                    saleId: null,
                    usuarioId: input.usuarioId
                }
            });
            return { updated, movementId: movement.id };
        });
        return { variant: this.toDomain(result.updated), movementId: result.movementId };
    }
    async sellerList(input) {
        const rows = await prisma_1.default.variant.findMany({
            where: {
                companyId: input.companyId,
                activo: true,
                product: { activo: true }
            },
            select: {
                id: true,
                nombre: true,
                precioVenta: true,
                stockActual: true
            },
            orderBy: { nombre: "asc" }
        });
        return rows.map((r) => ({
            id: r.id,
            nombre: r.nombre,
            precioVenta: r.precioVenta.toString(),
            stockActual: r.stockActual.toString()
        }));
    }
    async sellerSearch(input) {
        const q = input.q.trim();
        const rows = await prisma_1.default.variant.findMany({
            where: {
                companyId: input.companyId,
                activo: true,
                product: { activo: true },
                OR: [
                    { nombre: { contains: q, mode: "insensitive" } },
                    { sku: { contains: q, mode: "insensitive" } },
                    { codigoBarras: { contains: q, mode: "insensitive" } },
                    { product: { nombre: { contains: q, mode: "insensitive" } } }
                ]
            },
            select: {
                id: true,
                nombre: true,
                precioVenta: true,
                stockActual: true
            },
            orderBy: { nombre: "asc" },
            take: 50
        });
        return rows.map((r) => ({
            id: r.id,
            nombre: r.nombre,
            precioVenta: r.precioVenta.toString(),
            stockActual: r.stockActual.toString()
        }));
    }
    toDomain(row) {
        return new Variant_1.Variant(row.id, row.companyId, row.productId, row.nombre, row.sku, row.codigoBarras, row.atributos, row.unitType, row.precioCompra.toString(), row.precioVenta.toString(), row.stockActual.toString(), row.stockMinimo.toString(), row.ubicacion, row.activo, row.creadoPor, row.createdAt, row.updatedAt);
    }
}
exports.PrismaVariantRepository = PrismaVariantRepository;
