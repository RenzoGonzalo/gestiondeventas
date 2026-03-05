import prisma from "../../../shared/infrastructure/persistence/prisma";
import { CategoryRepository } from "../domain/CategoryRepository";
import { Category } from "../domain/Category";
import { InventoryNotFoundError } from "../domain/InventoryErrors";

export class PrismaCategoryRepository implements CategoryRepository {
  async create(input: {
    companyId: string;
    nombre: string;
    descripcion?: string | null;
  }): Promise<Category> {
    const created = await prisma.category.create({
      data: {
        companyId: input.companyId,
        nombre: input.nombre,
        descripcion: input.descripcion ?? null,
        activo: true
      }
    });

    return new Category(
      created.id,
      created.companyId,
      created.nombre,
      created.descripcion,
      created.activo,
      created.createdAt,
      created.updatedAt
    );
  }

  async listByCompany(companyId: string): Promise<Category[]> {
    const rows = await prisma.category.findMany({
      where: { companyId },
      orderBy: { nombre: "asc" }
    });

    return rows.map(
      (c) =>
        new Category(
          c.id,
          c.companyId,
          c.nombre,
          c.descripcion,
          c.activo,
          c.createdAt,
          c.updatedAt
        )
    );
  }

  async findById(input: { companyId: string; id: string }): Promise<Category | null> {
    const row = await prisma.category.findFirst({
      where: { id: input.id, companyId: input.companyId }
    });

    if (!row) return null;

    return new Category(
      row.id,
      row.companyId,
      row.nombre,
      row.descripcion,
      row.activo,
      row.createdAt,
      row.updatedAt
    );
  }

  async update(input: {
    companyId: string;
    id: string;
    nombre?: string;
    descripcion?: string | null;
    activo?: boolean;
  }): Promise<Category> {
    const existing = await prisma.category.findFirst({
      where: { id: input.id, companyId: input.companyId }
    });

    if (!existing) throw new InventoryNotFoundError("Category not found");

    const updated = await prisma.category.update({
      where: { id: input.id },
      data: {
        nombre: input.nombre ?? undefined,
        descripcion: input.descripcion ?? undefined,
        activo: input.activo ?? undefined
      }
    });

    return new Category(
      updated.id,
      updated.companyId,
      updated.nombre,
      updated.descripcion,
      updated.activo,
      updated.createdAt,
      updated.updatedAt
    );
  }

  async delete(input: { companyId: string; id: string }): Promise<void> {
    const existing = await prisma.category.findFirst({
      where: { id: input.id, companyId: input.companyId }
    });

    if (!existing) throw new InventoryNotFoundError("Category not found");

    await prisma.category.delete({ where: { id: input.id } });
  }

  async countProducts(input: { companyId: string; categoryId: string }): Promise<number> {
    return prisma.product.count({
      where: { companyId: input.companyId, categoryId: input.categoryId }
    });
  }
}
