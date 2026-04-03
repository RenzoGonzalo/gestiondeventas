import prisma from "../../../shared/infrastructure/persistence/prisma";
import { VariantRepository } from "../domain/VariantRepository";
import { Variant } from "../domain/Variant";
import { InventoryNotFoundError } from "../domain/InventoryErrors";

export class PrismaVariantRepository implements VariantRepository {
  async listByProduct(input: { companyId: string; productId: string }): Promise<Variant[]> {
    const rows = await prisma.variant.findMany({
      where: { companyId: input.companyId, productId: input.productId },
      orderBy: { nombre: "asc" }
    });

    return rows.map((v) => this.toDomain(v));
  }

  async create(input: {
    companyId: string;
    productId: string;
    nombre: string;
    sku: string;
    codigoBarras?: string | null;
    atributos: unknown;
    unitType?: string;
    precioCompra: string;
    precioVenta: string;
    stockActual?: string;
    stockMinimo?: string;
    ubicacion?: string | null;
    activo?: boolean;
    creadoPor: string;
  }): Promise<Variant> {
    const product = await prisma.product.findFirst({
      where: { id: input.productId, companyId: input.companyId }
    });

    if (!product) throw new InventoryNotFoundError("Product not found");

    const created = await prisma.variant.create({
      data: {
        companyId: input.companyId,
        productId: input.productId,
        nombre: input.nombre,
        sku: input.sku,
        codigoBarras: input.codigoBarras ?? null,
        atributos: input.atributos as any,
        unitType: (input.unitType as any) ?? undefined,
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

  async update(input: {
    companyId: string;
    id: string;
    nombre?: string;
    sku?: string;
    codigoBarras?: string | null;
    atributos?: unknown;
    unitType?: string;
    precioCompra?: string;
    precioVenta?: string;
    stockMinimo?: string;
    ubicacion?: string | null;
    activo?: boolean;
  }): Promise<Variant> {
    const existing = await prisma.variant.findFirst({
      where: { id: input.id, companyId: input.companyId }
    });

    if (!existing) throw new InventoryNotFoundError("Variant not found");

    const updated = await prisma.variant.update({
      where: { id: input.id },
      data: {
        nombre: input.nombre ?? undefined,
        sku: input.sku ?? undefined,
        codigoBarras: input.codigoBarras ?? undefined,
        atributos: input.atributos === undefined ? undefined : (input.atributos as any),
        unitType: (input.unitType as any) ?? undefined,
        precioCompra: input.precioCompra ?? undefined,
        precioVenta: input.precioVenta ?? undefined,
        stockMinimo: input.stockMinimo ?? undefined,
        ubicacion: input.ubicacion ?? undefined,
        activo: input.activo ?? undefined
      }
    });

    return this.toDomain(updated);
  }

  async delete(input: { companyId: string; id: string }): Promise<void> {
    const existing = await prisma.variant.findFirst({
      where: { id: input.id, companyId: input.companyId }
    });

    if (!existing) throw new InventoryNotFoundError("Variant not found");

    await prisma.variant.delete({ where: { id: input.id } });
  }

  async findById(input: { companyId: string; id: string }): Promise<Variant | null> {
    const row = await prisma.variant.findFirst({
      where: { id: input.id, companyId: input.companyId }
    });

    return row ? this.toDomain(row) : null;
  }

  async countStockMovements(input: { companyId: string; variantId: string }): Promise<number> {
    return prisma.stockMovement.count({
      where: { companyId: input.companyId, variantId: input.variantId }
    });
  }

  async adjustStock(input: {
    companyId: string;
    variantId: string;
    cantidad: string;
    motivo?: string | null;
    usuarioId: string;
  }): Promise<{ variant: Variant; movementId: string }> {
    const result = await prisma.$transaction(async (tx) => {
      const existing = await tx.variant.findFirst({
        where: { id: input.variantId, companyId: input.companyId }
      });

      if (!existing) throw new InventoryNotFoundError("Variant not found");

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

  async sellerList(input: { companyId: string }): Promise<Array<{ id: string; nombre: string; precioVenta: string; stockActual: string }>> {
    const rows = await prisma.variant.findMany({
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

  async sellerSearch(input: { companyId: string; q: string }): Promise<Array<{ id: string; nombre: string; precioVenta: string; stockActual: string }>> {
    const q = input.q.trim();

    const rows = await prisma.variant.findMany({
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

  private toDomain(row: {
    id: string;
    companyId: string;
    productId: string;
    nombre: string;
    sku: string;
    codigoBarras: string | null;
    atributos: any;
    unitType: any;
    precioCompra: any;
    precioVenta: any;
    stockActual: any;
    stockMinimo: any;
    ubicacion: string | null;
    activo: boolean;
    creadoPor: string;
    createdAt: Date;
    updatedAt: Date;
  }): Variant {
    return new Variant(
      row.id,
      row.companyId,
      row.productId,
      row.nombre,
      row.sku,
      row.codigoBarras,
      row.atributos,
      row.unitType,
      row.precioCompra.toString(),
      row.precioVenta.toString(),
      row.stockActual.toString(),
      row.stockMinimo.toString(),
      row.ubicacion,
      row.activo,
      row.creadoPor,
      row.createdAt,
      row.updatedAt
    );
  }
}
