import { Request, Response } from "express";
import { AppError } from "../../../shared/application/errors/AppError";
import { GetDashboardUseCase } from "../application/GetDashboardUseCase";
import { GetDailySalesUseCase } from "../application/GetDailySalesUseCase";
import { GetTopProductsUseCase } from "../application/GetTopProductsUseCase";
import { GetLowStockUseCase } from "../application/GetLowStockUseCase";
import { GetSellersPerformanceUseCase } from "../application/GetSellersPerformanceUseCase";

function parseDateOrUndefined(input: unknown): Date | undefined {
  if (input === undefined || input === null) return undefined;
  const d = new Date(String(input));
  return Number.isNaN(d.getTime()) ? undefined : d;
}

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

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

export class ReportsController {
  constructor(
    private readonly getDashboardUseCase: GetDashboardUseCase,
    private readonly getDailySalesUseCase: GetDailySalesUseCase,
    private readonly getTopProductsUseCase: GetTopProductsUseCase,
    private readonly getLowStockUseCase: GetLowStockUseCase,
    private readonly getSellersPerformanceUseCase: GetSellersPerformanceUseCase
  ) {}

  getDashboard = async (req: Request & { user?: any }, res: Response) => {
    try {
      const companyId = req.user?.companyId as string | null;
      if (!companyId) return res.status(403).json({ message: "No autorizado: usuario sin companyId" });

      const result = await this.getDashboardUseCase.execute({ companyId });
      return res.status(200).json(result);
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(400).json({ message: error.message });
    }
  };

  getDailySales = async (req: Request & { user?: any }, res: Response) => {
    try {
      const companyId = req.user?.companyId as string | null;
      if (!companyId) return res.status(403).json({ message: "No autorizado: usuario sin companyId" });

      const fromQ = parseDateOrUndefined(req.query.from);
      const toQ = parseDateOrUndefined(req.query.to);

      const from = startOfDay(fromQ ?? daysAgo(6)); // último 7 días
      const to = endOfDay(toQ ?? new Date());

      const result = await this.getDailySalesUseCase.execute({ companyId, from, to });
      return res.status(200).json({ from, to, rows: result });
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(400).json({ message: error.message });
    }
  };

  getTopProducts = async (req: Request & { user?: any }, res: Response) => {
    try {
      const companyId = req.user?.companyId as string | null;
      if (!companyId) return res.status(403).json({ message: "No autorizado: usuario sin companyId" });

      const fromQ = parseDateOrUndefined(req.query.from);
      const toQ = parseDateOrUndefined(req.query.to);

      const limit = Math.max(1, Math.min(50, Number(req.query.limit ?? 10) || 10));
      const from = startOfDay(fromQ ?? daysAgo(29));
      const to = endOfDay(toQ ?? new Date());

      const result = await this.getTopProductsUseCase.execute({ companyId, from, to, limit });
      return res.status(200).json({ from, to, limit, rows: result });
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(400).json({ message: error.message });
    }
  };

  getLowStock = async (req: Request & { user?: any }, res: Response) => {
    try {
      const companyId = req.user?.companyId as string | null;
      if (!companyId) return res.status(403).json({ message: "No autorizado: usuario sin companyId" });

      const limit = Math.max(1, Math.min(200, Number(req.query.limit ?? 50) || 50));
      const result = await this.getLowStockUseCase.execute({ companyId, limit });

      return res.status(200).json({ limit, rows: result });
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(400).json({ message: error.message });
    }
  };

  getSellersPerformance = async (req: Request & { user?: any }, res: Response) => {
    try {
      const companyId = req.user?.companyId as string | null;
      if (!companyId) return res.status(403).json({ message: "No autorizado: usuario sin companyId" });

      const fromQ = parseDateOrUndefined(req.query.from);
      const toQ = parseDateOrUndefined(req.query.to);

      const limit = Math.max(1, Math.min(50, Number(req.query.limit ?? 10) || 10));
      const from = startOfDay(fromQ ?? daysAgo(29));
      const to = endOfDay(toQ ?? new Date());

      const result = await this.getSellersPerformanceUseCase.execute({ companyId, from, to, limit });
      return res.status(200).json({ from, to, limit, rows: result });
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(400).json({ message: error.message });
    }
  };
}
