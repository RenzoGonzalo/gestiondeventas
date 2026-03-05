import { Router } from "express";
import { ProductController } from "./ProductController";
import { VariantController } from "./VariantController";
import { authMiddleware, requireStoreAdmin } from "../../../shared/infrastructure/auth/authMiddleware";

const router = Router();
const productController = new ProductController();
const variantController = new VariantController();

router.post("/", authMiddleware, requireStoreAdmin, productController.create);
router.get("/", authMiddleware, requireStoreAdmin, productController.list);
router.get("/:id", authMiddleware, requireStoreAdmin, productController.getById);
router.put("/:id", authMiddleware, requireStoreAdmin, productController.update);
router.delete("/:id", authMiddleware, requireStoreAdmin, productController.delete);

// Variantes bajo un producto
router.post("/:id/variants", authMiddleware, requireStoreAdmin, variantController.addToProduct);

export default router;
