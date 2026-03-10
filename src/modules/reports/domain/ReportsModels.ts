export type ReportMoney = string; // Decimal as string

export type DailySalesRow = {
  date: string; // YYYY-MM-DD
  total: ReportMoney;
  count: number;
};

export type TopProductRow = {
  variantId: string;
  variantNombre: string;
  sku: string;
  productId: string;
  productNombre: string;
  quantity: string;
  subtotal: ReportMoney;
  lines: number;
};

export type LowStockRow = {
  variantId: string;
  variantNombre: string;
  sku: string;
  productId: string;
  productNombre: string;
  stockActual: string;
  stockMinimo: string;
};

export type SellerPerformanceRow = {
  sellerId: string;
  sellerNombre: string;
  sellerEmail: string;
  salesCount: number;
  total: ReportMoney;
};

export type DashboardReport = {
  today: { total: ReportMoney; count: number };
  month: { total: ReportMoney; count: number };
  lowStockCount: number;
};
