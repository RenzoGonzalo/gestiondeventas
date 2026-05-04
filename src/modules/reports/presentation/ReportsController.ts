import { Request, Response } from "express";
import { AppError } from "../../../shared/application/errors/AppError";
import { GetDashboardUseCase } from "../application/GetDashboardUseCase";
import { GetDailySalesUseCase } from "../application/GetDailySalesUseCase";
import { GetTopProductsUseCase } from "../application/GetTopProductsUseCase";
import { GetLowStockUseCase } from "../application/GetLowStockUseCase";
import { GetSellersPerformanceUseCase } from "../application/GetSellersPerformanceUseCase";

const REPORT_TIME_ZONE = "America/Bogota";

type YMD = { year: number; month: number; day: number };

function parseYMD(input: unknown): YMD | undefined {
  const raw = String(input ?? "").trim();
  const m = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return undefined;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return undefined;
  return { year, month, day };
}

function parseQueryDayInTimeZone(input: unknown, timeZone: string): YMD | undefined {
  const asYmd = parseYMD(input);
  if (asYmd) return asYmd;

  if (input === undefined || input === null) return undefined;
  const d = new Date(String(input));
  if (Number.isNaN(d.getTime())) return undefined;
  return getYMDInTimeZone(d, timeZone);
}

function getYMDInTimeZone(date: Date, timeZone: string): YMD {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });

  const parts = dtf.formatToParts(date);
  const map: Record<string, string> = {};
  for (const p of parts) map[p.type] = p.value;

  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day)
  };
}

function ymdToUtcDate(ymd: YMD): Date {
  return new Date(Date.UTC(ymd.year, ymd.month - 1, ymd.day));
}

function addDays(ymd: YMD, delta: number): YMD {
  const d = ymdToUtcDate(ymd);
  d.setUTCDate(d.getUTCDate() + delta);
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() };
}

function getTimeZoneOffsetMs(date: Date, timeZone: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });

  const parts = dtf.formatToParts(date);
  const map: Record<string, string> = {};
  for (const p of parts) map[p.type] = p.value;

  const asUTC = Date.UTC(
    Number(map.year),
    Number(map.month) - 1,
    Number(map.day),
    Number(map.hour),
    Number(map.minute),
    Number(map.second)
  );

  return asUTC - date.getTime();
}

function zonedTimeToUtc(input: {
  ymd: YMD;
  hour: number;
  minute: number;
  second: number;
  ms: number;
  timeZone: string;
}): Date {
  const guess = new Date(
    Date.UTC(
      input.ymd.year,
      input.ymd.month - 1,
      input.ymd.day,
      input.hour,
      input.minute,
      input.second,
      input.ms
    )
  );

  const offset = getTimeZoneOffsetMs(guess, input.timeZone);
  return new Date(guess.getTime() - offset);
}

function utcRangeForLocalDays(fromYmd: YMD, toYmd: YMD, timeZone: string): { from: Date; to: Date } {
  let fromMs = ymdToUtcDate(fromYmd).getTime();
  let toMs = ymdToUtcDate(toYmd).getTime();
  if (fromMs > toMs) {
    const tmp = fromYmd;
    fromYmd = toYmd;
    toYmd = tmp;
  }

  const from = zonedTimeToUtc({ ymd: fromYmd, hour: 0, minute: 0, second: 0, ms: 0, timeZone });
  const to = zonedTimeToUtc({ ymd: toYmd, hour: 23, minute: 59, second: 59, ms: 999, timeZone });
  return { from, to };
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

      const today = getYMDInTimeZone(new Date(), REPORT_TIME_ZONE);
      const fromYmd = parseQueryDayInTimeZone(req.query.from, REPORT_TIME_ZONE) ?? addDays(today, -6);
      const toYmd = parseQueryDayInTimeZone(req.query.to, REPORT_TIME_ZONE) ?? today;
      const { from, to } = utcRangeForLocalDays(fromYmd, toYmd, REPORT_TIME_ZONE);

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

      const today = getYMDInTimeZone(new Date(), REPORT_TIME_ZONE);
      const fromYmd = parseQueryDayInTimeZone(req.query.from, REPORT_TIME_ZONE) ?? addDays(today, -29);
      const toYmd = parseQueryDayInTimeZone(req.query.to, REPORT_TIME_ZONE) ?? today;

      const limit = Math.max(1, Math.min(50, Number(req.query.limit ?? 10) || 10));
      const { from, to } = utcRangeForLocalDays(fromYmd, toYmd, REPORT_TIME_ZONE);

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

      const today = getYMDInTimeZone(new Date(), REPORT_TIME_ZONE);
      const fromYmd = parseQueryDayInTimeZone(req.query.from, REPORT_TIME_ZONE) ?? addDays(today, -29);
      const toYmd = parseQueryDayInTimeZone(req.query.to, REPORT_TIME_ZONE) ?? today;

      const limit = Math.max(1, Math.min(50, Number(req.query.limit ?? 10) || 10));
      const { from, to } = utcRangeForLocalDays(fromYmd, toYmd, REPORT_TIME_ZONE);

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
