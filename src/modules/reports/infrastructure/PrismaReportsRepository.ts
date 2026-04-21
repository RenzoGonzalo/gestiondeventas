import prisma from "../../../shared/infrastructure/persistence/prisma";
import { ReportsRepository } from "../domain/ReportsRepository";
import {
  DashboardReport,
  DailySalesRow,
  LowStockRow,
  SellerPerformanceRow,
  TopProductRow
} from "../domain/ReportsModels";

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function endOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

function startOfMonth(d: Date) {
  const x = new Date(d.getFullYear(), d.getMonth(), 1);
  x.setHours(0, 0, 0, 0);
  return x;
}

function toYMD(date: Date) {
  return date.toISOString().slice(0, 10);
}

// Nota: en Postgres, `createdAt` está creado como TIMESTAMP (sin tz) en las migraciones.
// En Docker Postgres usa UTC por defecto, así que estos timestamps se interpretan como UTC “naive”.
// Para obtener el día/mes en la zona local de la tienda debemos convertir UTC -> zona local.
const DB_TIME_ZONE = "UTC";
const REPORT_TIME_ZONE = "America/Bogota";

export class PrismaReportsRepository implements ReportsRepository {
  async getDashboard(input: { companyId: string }): Promise<DashboardReport> {
    const [todayRows, monthRows, lowStockCount] = await Promise.all([
      prisma.$queryRaw<Array<{ total: string; count: bigint }>>`
        SELECT
          COALESCE(SUM(total), 0)::text as total,
          COUNT(*)::bigint as count
        FROM sales
        WHERE "companyId" = ${input.companyId}
          AND status = 'COMPLETADA'
          AND (("createdAt" AT TIME ZONE ${DB_TIME_ZONE}) AT TIME ZONE ${REPORT_TIME_ZONE})::date = (NOW() AT TIME ZONE ${REPORT_TIME_ZONE})::date;
      `,
      prisma.$queryRaw<Array<{ total: string; count: bigint }>>`
        SELECT
          COALESCE(SUM(total), 0)::text as total,
          COUNT(*)::bigint as count
        FROM sales
        WHERE "companyId" = ${input.companyId}
          AND status = 'COMPLETADA'
          AND EXTRACT(YEAR FROM (("createdAt" AT TIME ZONE ${DB_TIME_ZONE}) AT TIME ZONE ${REPORT_TIME_ZONE})) = EXTRACT(YEAR FROM (NOW() AT TIME ZONE ${REPORT_TIME_ZONE}))
          AND EXTRACT(MONTH FROM (("createdAt" AT TIME ZONE ${DB_TIME_ZONE}) AT TIME ZONE ${REPORT_TIME_ZONE})) = EXTRACT(MONTH FROM (NOW() AT TIME ZONE ${REPORT_TIME_ZONE}));
      `,
      this.getLowStockCount({ companyId: input.companyId })
    ]);

    const todayAgg = todayRows[0];
    const monthAgg = monthRows[0];

    return {
      today: {
        total: todayAgg?.total ?? "0.00",
        count: Number(todayAgg?.count ?? 0)
      },
      month: {
        total: monthAgg?.total ?? "0.00",
        count: Number(monthAgg?.count ?? 0)
      },
      lowStockCount
    };
  }

  async getDailySales(input: { companyId: string; from: Date; to: Date }): Promise<DailySalesRow[]> {
    const rows = await prisma.$queryRaw<
      Array<{ day: Date; total: string | null; count: bigint }>
    >`
      SELECT
        date_trunc('day', "createdAt")::date as day,
        COALESCE(SUM(total), 0)::text as total,
        COUNT(*)::bigint as count
      FROM sales
      WHERE "companyId" = ${input.companyId}
        AND status = 'COMPLETADA'
        AND "createdAt" >= ${input.from}
        AND "createdAt" <= ${input.to}
      GROUP BY 1
      ORDER BY 1 ASC;
    `;

    return rows.map((r) => ({
      date: toYMD(r.day),
      total: r.total ?? "0",
      count: Number(r.count)
    }));
  }

  async getTopProducts(input: {
    companyId: string;
    from: Date;
    to: Date;
    limit: number;
  }): Promise<TopProductRow[]> {
    const grouped = await prisma.saleItem.groupBy({
      by: ["variantId"],
      where: {
        sale: {
          companyId: input.companyId,
          status: "COMPLETADA",
          createdAt: { gte: input.from, lte: input.to }
        }
      },
      _sum: { quantity: true, subtotal: true },
      _count: { _all: true },
      orderBy: { _sum: { subtotal: "desc" } },
      take: input.limit
    });

    const variantIds = grouped.map((g) => g.variantId);
    if (!variantIds.length) return [];

    const variants = await prisma.variant.findMany({
      where: { id: { in: variantIds }, companyId: input.companyId },
      select: {
        id: true,
        nombre: true,
        sku: true,
        product: { select: { id: true, nombre: true } }
      }
    });

    const variantById = new Map(variants.map((v) => [v.id, v] as const));

    return grouped
      .map((g) => {
        const v = variantById.get(g.variantId);
        if (!v) return null;

        return {
          variantId: v.id,
          variantNombre: v.nombre,
          sku: v.sku,
          productId: v.product.id,
          productNombre: v.product.nombre,
          quantity: g._sum.quantity ? g._sum.quantity.toString() : "0",
          subtotal: g._sum.subtotal ? g._sum.subtotal.toString() : "0.00",
          lines: g._count._all
        } satisfies TopProductRow;
      })
      .filter((x): x is TopProductRow => Boolean(x));
  }

  async getLowStock(input: { companyId: string; limit: number }): Promise<LowStockRow[]> {
    const rows = await prisma.$queryRaw<
      Array<{
        variantId: string;
        variantNombre: string;
        sku: string;
        productId: string;
        productNombre: string;
        stockActual: string;
        stockMinimo: string;
      }>
    >`
      SELECT
        v.id as "variantId",
        v.nombre as "variantNombre",
        v.sku as "sku",
        p.id as "productId",
        p.nombre as "productNombre",
        v."stockActual"::text as "stockActual",
        v."stockMinimo"::text as "stockMinimo"
      FROM variants v
      JOIN products p ON p.id = v."productId"
      WHERE v."companyId" = ${input.companyId}
        AND v.activo = true
        AND v."stockActual" <= v."stockMinimo"
      ORDER BY v."stockActual" ASC
      LIMIT ${input.limit};
    `;

    return rows;
  }

  async getSellersPerformance(input: {
    companyId: string;
    from: Date;
    to: Date;
    limit: number;
  }): Promise<SellerPerformanceRow[]> {
    const grouped = await prisma.sale.groupBy({
      by: ["sellerId"],
      where: {
        companyId: input.companyId,
        status: "COMPLETADA",
        createdAt: { gte: input.from, lte: input.to }
      },
      _sum: { total: true },
      _count: { _all: true },
      orderBy: { _sum: { total: "desc" } },
      take: input.limit
    });

    const sellerIds = grouped.map((g) => g.sellerId);
    if (!sellerIds.length) return [];

    const sellers = await prisma.user.findMany({
      where: { id: { in: sellerIds }, companyId: input.companyId },
      select: { id: true, nombre: true, email: true }
    });

    const sellerById = new Map(sellers.map((s) => [s.id, s] as const));

    return grouped
      .map((g) => {
        const s = sellerById.get(g.sellerId);
        if (!s) return null;

        return {
          sellerId: s.id,
          sellerNombre: s.nombre,
          sellerEmail: s.email,
          salesCount: g._count._all,
          total: g._sum.total ? g._sum.total.toString() : "0.00"
        } satisfies SellerPerformanceRow;
      })
      .filter((x): x is SellerPerformanceRow => Boolean(x));
  }

  private async getLowStockCount(input: { companyId: string }): Promise<number> {
    const rows = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*)::bigint as count
      FROM variants v
      WHERE v."companyId" = ${input.companyId}
        AND v.activo = true
        AND v."stockActual" <= v."stockMinimo";
    `;

    const n = rows[0]?.count ?? BigInt(0);
    return Number(n);
  }
}
