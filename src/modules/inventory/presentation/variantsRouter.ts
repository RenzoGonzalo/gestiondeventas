import { Router } from "express";
import { authMiddleware, requireStoreAdmin } from "../../../shared/infrastructure/auth/authMiddleware";
import { variantController } from "../inventory.dependencies";

const router = Router();

router.put("/:id", authMiddleware, requireStoreAdmin, variantController.update);
router.delete("/:id", authMiddleware, requireStoreAdmin, variantController.delete);
router.post("/:id/stock/adjust", authMiddleware, requireStoreAdmin, variantController.adjustStock);

export default router;
