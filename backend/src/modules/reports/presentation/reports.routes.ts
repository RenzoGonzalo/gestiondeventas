import { Router } from "express";
import { authMiddleware, requireStoreAdmin } from "../../../shared/infrastructure/auth/authMiddleware";
import { reportsController } from "./reports.dependencies";

const router = Router();

// Todos los reportes son exclusivos para STORE_ADMIN
router.get("/dashboard", authMiddleware, requireStoreAdmin, reportsController.getDashboard);
router.get("/sales/daily", authMiddleware, requireStoreAdmin, reportsController.getDailySales);
router.get("/products/top", authMiddleware, requireStoreAdmin, reportsController.getTopProducts);
router.get("/products/low-stock", authMiddleware, requireStoreAdmin, reportsController.getLowStock);
router.get("/sellers/performance", authMiddleware, requireStoreAdmin, reportsController.getSellersPerformance);

export default router;
