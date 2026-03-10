import { Router } from "express";
import { authMiddleware, requireStoreAdmin } from "../../../shared/infrastructure/auth/authMiddleware";
import { categoryController } from "../inventory.dependencies";

const router = Router();

router.post("/", authMiddleware, requireStoreAdmin, categoryController.create);
router.get("/", authMiddleware, requireStoreAdmin, categoryController.list);
router.get("/:id", authMiddleware, requireStoreAdmin, categoryController.getById);
router.put("/:id", authMiddleware, requireStoreAdmin, categoryController.update);
router.delete("/:id", authMiddleware, requireStoreAdmin, categoryController.delete);

export default router;
