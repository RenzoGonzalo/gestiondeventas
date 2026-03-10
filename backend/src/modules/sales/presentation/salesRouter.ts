import { Router } from "express";
import { authMiddleware, requireAnyRole, requireStoreAdmin } from "../../../shared/infrastructure/auth/authMiddleware";
import { salesController } from "../sales.dependencies";

const router = Router();

// Crear venta: STORE_ADMIN o SELLER
router.post("/", authMiddleware, requireAnyRole(["STORE_ADMIN", "SELLER"]), salesController.create);

// Listar ventas: solo STORE_ADMIN (MVP)
router.get("/", authMiddleware, requireStoreAdmin, salesController.list);

// Obtener venta
router.get("/:id", authMiddleware, requireStoreAdmin, salesController.getById);

// Anular venta
router.post("/:id/cancel", authMiddleware, requireStoreAdmin, salesController.cancel);

export default router;
