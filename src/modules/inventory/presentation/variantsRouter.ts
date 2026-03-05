import { Router } from "express";
import { VariantController } from "./VariantController";
import { authMiddleware, requireStoreAdmin } from "../../../shared/infrastructure/auth/authMiddleware";

const router = Router();
const controller = new VariantController();

router.put("/:id", authMiddleware, requireStoreAdmin, controller.update);
router.delete("/:id", authMiddleware, requireStoreAdmin, controller.delete);
router.post("/:id/stock/adjust", authMiddleware, requireStoreAdmin, controller.adjustStock);

export default router;
