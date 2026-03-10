import { DashboardReport, DailySalesRow, LowStockRow, SellerPerformanceRow, TopProductRow } from "./ReportsModels";

export interface ReportsRepository {
  getDashboard(input: { companyId: string }): Promise<DashboardReport>;

  getDailySales(input: { companyId: string; from: Date; to: Date }): Promise<DailySalesRow[]>;

  getTopProducts(input: {
    companyId: string;
    from: Date;
    to: Date;
    limit: number;
  }): Promise<TopProductRow[]>;

  getLowStock(input: { companyId: string; limit: number }): Promise<LowStockRow[]>;

  getSellersPerformance(input: {
    companyId: string;
    from: Date;
    to: Date;
    limit: number;
  }): Promise<SellerPerformanceRow[]>;
}
