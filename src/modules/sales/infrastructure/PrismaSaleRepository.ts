import prisma from "../../../shared/infrastructure/persistence/prisma";
import { Prisma } from "@prisma/client";
import { SaleRepository, CreateSaleItemInput } from "../domain/SaleRepository";
import { Sale } from "../domain/Sale";
import { SaleItem } from "../domain/SaleItem";
import { SalesBadRequestError, SalesConflictError, SalesNotFoundError } from "../domain/SalesErrors";

function formatReceipt(seq: number) {
  const serial = String(seq).padStart(6, "0");
  return `001-${serial}`;
}

function parseSeq(receiptNumber: string): number {
  const parts = receiptNumber.split("-");
  const last = parts[parts.length - 1] ?? "0";
  const n = Number(last);
  return Number.isFinite(n) ? n : 0;
}

export class PrismaSaleRepository implements SaleRepository {
  async create(input: { companyId: string; sellerId: string; items: CreateSaleItemInput[] }): Promise<Sale> {
    if (!input.items?.length) throw new SalesBadRequestError("Sale items required");

    // Puede fallar por concurrencia (2 ventas al mismo tiempo) o por reinicio de
    // correlativo diario. Como la BD exige uniqueness por (companyId, receiptNumber),
    // generamos correlativo por empresa (no se reinicia) y reintentamos si hay colisión.
    const maxAttempts = 5;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const result = await prisma.$transaction(async (tx) => {
          // validar seller
          const seller = await tx.user.findFirst({
            where: { id: input.sellerId, companyId: input.companyId }
          });
          if (!seller) throw new SalesBadRequestError("Seller not found for this company");

          // siguiente correlativo por empresa (NO por día)
          const lastSale = await tx.sale.findFirst({
            where: {
              companyId: input.companyId
            },
            orderBy: { receiptNumber: "desc" },
            select: { receiptNumber: true }
          });

          const nextSeq = (lastSale ? parseSeq(lastSale.receiptNumber) : 0) + 1;
          const receiptNumber = formatReceipt(nextSeq);

          // traer variantes y validar stock
          const variantIds = input.items.map((i) => i.variantId);
          const uniqueVariantIds = Array.from(new Set(variantIds));
          const variants = await tx.variant.findMany({
            where: { companyId: input.companyId, id: { in: uniqueVariantIds } },
            select: {
              id: true,
              precioVenta: true
            }
          });

          if (variants.length !== uniqueVariantIds.length) {
            throw new SalesBadRequestError("One or more variants not found for this company");
          }

          const variantById = new Map(variants.map((v) => [v.id, v] as const));

          const normalizedItems = input.items.map((it) => {
            const v = variantById.get(it.variantId)!;
            const quantity = Number(it.quantity);
            if (!Number.isFinite(quantity) || quantity <= 0) {
              throw new SalesBadRequestError("Invalid quantity");
            }

            const unitPrice = it.unitPrice ?? v.precioVenta.toString();
            const unitPriceNum = Number(unitPrice);
            if (!Number.isFinite(unitPriceNum) || unitPriceNum < 0) {
              throw new SalesBadRequestError("Invalid unitPrice");
            }

            const subtotal = (quantity * unitPriceNum).toFixed(2);

            return {
              variantId: it.variantId,
              quantity: quantity.toFixed(2),
              unitPrice: unitPriceNum.toFixed(2),
              subtotal
            };
          });

          const total = normalizedItems
            .reduce((acc, it) => acc + Number(it.subtotal), 0)
            .toFixed(2);

          // crear sale + items
          const sale = await tx.sale.create({
            data: {
              companyId: input.companyId,
              sellerId: input.sellerId,
              total,
              receiptNumber,
              status: "COMPLETADA",
              items: {
                create: normalizedItems.map((it) => ({
                  variantId: it.variantId,
                  quantity: it.quantity,
                  unitPrice: it.unitPrice,
                  subtotal: it.subtotal
                }))
              }
            },
            include: { items: true }
          });

          // descontar stock + movimientos
          for (const it of normalizedItems) {
            // Descuento atómico de stock para evitar oversell en concurrencia.
            // Si no hay stock suficiente, no actualiza nada y devolvemos conflicto.
            const qty = it.quantity; // string con 2 decimales
            const rows = (await tx.$queryRaw`
              UPDATE "variants"
              SET "stockActual" = "stockActual" - ${qty}::decimal
              WHERE "id" = ${it.variantId}
                AND "companyId" = ${input.companyId}
                AND "stockActual" >= ${qty}::decimal
              RETURNING ("stockActual" + ${qty}::decimal) AS "stockAnterior", "stockActual" AS "stockNuevo";
            `) as Array<{ stockAnterior: any; stockNuevo: any }>;

            if (!rows.length) {
              throw new SalesConflictError("Stock insuficiente");
            }

            const stockAnterior = String(rows[0]!.stockAnterior);
            const stockNuevo = String(rows[0]!.stockNuevo);

            await tx.stockMovement.create({
              data: {
                companyId: input.companyId,
                variantId: it.variantId,
                tipo: "VENTA",
                cantidad: (-Number(it.quantity)).toFixed(2),
                stockAnterior,
                stockNuevo,
                motivo: null,
                saleId: sale.id,
                usuarioId: input.sellerId
              }
            });
          }

          return sale;
        });

        return this.toDomain(result);
      } catch (error: any) {
        const isUniqueReceiptConflict =
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002" &&
          (Array.isArray((error.meta as any)?.target)
            ? ((error.meta as any).target as string[]).includes("receiptNumber")
            : String((error.meta as any)?.target ?? "").includes("receiptNumber"));

        if (isUniqueReceiptConflict) {
          if (attempt < maxAttempts) continue;
          throw new SalesConflictError("Receipt number conflict, retry");
        }

        throw error;
      }
    }

    throw new SalesConflictError("Could not generate unique receiptNumber");
  }

  async findById(input: { companyId: string; id: string }): Promise<Sale | null> {
    const row = await prisma.sale.findFirst({
      where: { id: input.id, companyId: input.companyId },
      include: { items: true }
    });

    return row ? this.toDomain(row) : null;
  }

  async listByCompany(input: { companyId: string; from?: Date; to?: Date }): Promise<Sale[]> {
    const rows = await prisma.sale.findMany({
      where: {
        companyId: input.companyId,
        createdAt: {
          gte: input.from ?? undefined,
          lte: input.to ?? undefined
        }
      },
      include: { items: true },
      orderBy: { createdAt: "desc" },
      take: 200
    });

    return rows.map((r) => this.toDomain(r));
  }

  async listBySeller(input: { companyId: string; sellerId: string; from?: Date; to?: Date }): Promise<Sale[]> {
    const rows = await prisma.sale.findMany({
      where: {
        companyId: input.companyId,
        sellerId: input.sellerId,
        createdAt: {
          gte: input.from ?? undefined,
          lte: input.to ?? undefined
        }
      },
      include: { items: true },
      orderBy: { createdAt: "desc" },
      take: 200
    });

    return rows.map((r) => this.toDomain(r));
  }

  async cancel(input: {
    companyId: string;
    id: string;
    cancelledByUserId: string;
    reason?: string | null;
  }): Promise<Sale> {
    const result = await prisma.$transaction(async (tx) => {
      const sale = await tx.sale.findFirst({
        where: { id: input.id, companyId: input.companyId },
        include: { items: true }
      });

      if (!sale) throw new SalesNotFoundError("Sale not found");
      if (sale.status === "ANULADA") throw new SalesConflictError("Sale already cancelled");

      // revertir stock
      for (const it of sale.items) {
        const variant = await tx.variant.findFirst({
          where: { id: it.variantId, companyId: input.companyId }
        });
        if (!variant) throw new SalesBadRequestError("Variant not found for this company");

        const stockAnterior = Number(variant.stockActual.toString());
        const delta = Number(it.quantity.toString());
        const stockNuevo = stockAnterior + delta;

        await tx.variant.update({
          where: { id: variant.id },
          data: { stockActual: stockNuevo.toFixed(2) }
        });

        await tx.stockMovement.create({
          data: {
            companyId: input.companyId,
            variantId: variant.id,
            tipo: "ANULACION_VENTA",
            cantidad: delta.toFixed(2),
            stockAnterior: stockAnterior.toFixed(2),
            stockNuevo: stockNuevo.toFixed(2),
            motivo: input.reason ?? null,
            saleId: sale.id,
            usuarioId: input.cancelledByUserId
          }
        });
      }

      const updated = await tx.sale.update({
        where: { id: sale.id },
        data: { status: "ANULADA" },
        include: { items: true }
      });

      return updated;
    });

    return this.toDomain(result);
  }

  private toDomain(row: any): Sale {
    const items = (row.items ?? []).map(
      (it: any) =>
        new SaleItem(
          it.id,
          it.saleId,
          it.variantId,
          it.quantity.toString(),
          it.unitPrice.toString(),
          it.subtotal.toString()
        )
    );

    return new Sale(
      row.id,
      row.companyId,
      row.sellerId,
      row.total.toString(),
      row.receiptNumber,
      row.status,
      items,
      row.createdAt,
      row.updatedAt
    );
  }
}
