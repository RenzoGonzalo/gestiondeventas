import { Router } from "express";
import { authMiddleware, requireStoreAdmin } from "../../../shared/infrastructure/auth/authMiddleware";
import { productController, variantController } from "../inventory.dependencies";

const router = Router();

router.post("/", authMiddleware, requireStoreAdmin, productController.create);
router.get("/", authMiddleware, requireStoreAdmin, productController.list);
router.get("/:id", authMiddleware, requireStoreAdmin, productController.getById);
router.put("/:id", authMiddleware, requireStoreAdmin, productController.update);
router.delete("/:id", authMiddleware, requireStoreAdmin, productController.delete);

// Variantes bajo un producto
router.post("/:id/variants", authMiddleware, requireStoreAdmin, variantController.addToProduct);

export default router;
