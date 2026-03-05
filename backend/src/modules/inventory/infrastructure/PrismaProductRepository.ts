import prisma from "../../../shared/infrastructure/persistence/prisma";
import { ProductRepository } from "../domain/ProductRepository";
import { Product } from "../domain/Product";
import { InventoryNotFoundError } from "../domain/InventoryErrors";

export class PrismaProductRepository implements ProductRepository {
  async createWithVariants(input: {
    companyId: string;
    categoryId: string;
    nombre: string;
    descripcion?: string | null;
    imagen?: string | null;
    activo?: boolean;
    atributos?: unknown;
    unitType?: string;
    creadoPor: string;
    variantes: Array<{
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
    }>;
  }): Promise<{ product: Product; variantIds: string[] }> {
    const category = await prisma.category.findFirst({
      where: { id: input.categoryId, companyId: input.companyId }
    });

    if (!category) throw new InventoryNotFoundError("Category not found");

    const created = await prisma.product.create({
      data: {
        companyId: input.companyId,
        categoryId: input.categoryId,
        nombre: input.nombre,
        descripcion: input.descripcion ?? null,
        imagen: input.imagen ?? null,
        activo: input.activo ?? true,
        atributos: (input.atributos ?? []) as any,
        unitType: (input.unitType as any) ?? undefined,
        variantes: {
          create: input.variantes.map((v) => ({
            companyId: input.companyId,
            nombre: v.nombre,
            sku: v.sku,
            codigoBarras: v.codigoBarras ?? null,
            atributos: v.atributos as any,
            unitType: (v.unitType as any) ?? ((input.unitType as any) ?? undefined),
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

    const product = new Product(
      created.id,
      created.companyId,
      created.categoryId,
      created.nombre,
      created.descripcion,
      created.imagen,
      created.activo,
      created.atributos,
      created.unitType as any,
      created.createdAt,
      created.updatedAt
    );

    return {
      product,
      variantIds: created.variantes.map((v) => v.id)
    };
  }

  async listByCompany(input: { companyId: string; categoryId?: string }): Promise<Product[]> {
    const rows = await prisma.product.findMany({
      where: {
        companyId: input.companyId,
        categoryId: input.categoryId ?? undefined
      },
      orderBy: { nombre: "asc" }
    });

    return rows.map(
      (p) =>
        new Product(
          p.id,
          p.companyId,
          p.categoryId,
          p.nombre,
          p.descripcion,
          p.imagen,
          p.activo,
          p.atributos,
          p.unitType as any,
          p.createdAt,
          p.updatedAt
        )
    );
  }

  async findById(input: { companyId: string; id: string }): Promise<Product | null> {
    const row = await prisma.product.findFirst({
      where: { id: input.id, companyId: input.companyId }
    });

    if (!row) return null;

    return new Product(
      row.id,
      row.companyId,
      row.categoryId,
      row.nombre,
      row.descripcion,
      row.imagen,
      row.activo,
      row.atributos,
      row.unitType as any,
      row.createdAt,
      row.updatedAt
    );
  }

  async update(input: {
    companyId: string;
    id: string;
    nombre?: string;
    descripcion?: string | null;
    imagen?: string | null;
    activo?: boolean;
    atributos?: unknown;
    unitType?: string;
    categoryId?: string;
  }): Promise<Product> {
    const existing = await prisma.product.findFirst({
      where: { id: input.id, companyId: input.companyId }
    });

    if (!existing) throw new InventoryNotFoundError("Product not found");

    if (input.categoryId) {
      const category = await prisma.category.findFirst({
        where: { id: input.categoryId, companyId: input.companyId }
      });
      if (!category) throw new InventoryNotFoundError("Category not found");
    }

    const updated = await prisma.product.update({
      where: { id: input.id },
      data: {
        nombre: input.nombre ?? undefined,
        descripcion: input.descripcion ?? undefined,
        imagen: input.imagen ?? undefined,
        activo: input.activo ?? undefined,
        atributos: input.atributos === undefined ? undefined : (input.atributos as any),
        unitType: (input.unitType as any) ?? undefined,
        categoryId: input.categoryId ?? undefined
      }
    });

    return new Product(
      updated.id,
      updated.companyId,
      updated.categoryId,
      updated.nombre,
      updated.descripcion,
      updated.imagen,
      updated.activo,
      updated.atributos,
      updated.unitType as any,
      updated.createdAt,
      updated.updatedAt
    );
  }

  async delete(input: { companyId: string; id: string }): Promise<void> {
    const existing = await prisma.product.findFirst({
      where: { id: input.id, companyId: input.companyId }
    });

    if (!existing) throw new InventoryNotFoundError("Product not found");

    await prisma.product.delete({ where: { id: input.id } });
  }

  async countStockMovementsByProduct(input: { companyId: string; productId: string }): Promise<number> {
    return prisma.stockMovement.count({
      where: {
        companyId: input.companyId,
        variant: { productId: input.productId }
      }
    });
  }
}
