import { PrismaReportsRepository } from "../infrastructure/PrismaReportsRepository";
import { GetDashboardUseCase } from "../application/GetDashboardUseCase";
import { GetDailySalesUseCase } from "../application/GetDailySalesUseCase";
import { GetTopProductsUseCase } from "../application/GetTopProductsUseCase";
import { GetLowStockUseCase } from "../application/GetLowStockUseCase";
import { GetSellersPerformanceUseCase } from "../application/GetSellersPerformanceUseCase";
import { ReportsController } from "./ReportsController";

const reportsRepository = new PrismaReportsRepository();

const getDashboardUseCase = new GetDashboardUseCase(reportsRepository);
const getDailySalesUseCase = new GetDailySalesUseCase(reportsRepository);
const getTopProductsUseCase = new GetTopProductsUseCase(reportsRepository);
const getLowStockUseCase = new GetLowStockUseCase(reportsRepository);
const getSellersPerformanceUseCase = new GetSellersPerformanceUseCase(reportsRepository);

export const reportsController = new ReportsController(
  getDashboardUseCase,
  getDailySalesUseCase,
  getTopProductsUseCase,
  getLowStockUseCase,
  getSellersPerformanceUseCase
);
