import { Router } from "express";
import { CategoryController } from "./CategoryController";
import { authMiddleware, requireStoreAdmin } from "../../../shared/infrastructure/auth/authMiddleware";

const router = Router();
const controller = new CategoryController();

router.post("/", authMiddleware, requireStoreAdmin, controller.create);
router.get("/", authMiddleware, requireStoreAdmin, controller.list);
router.get("/:id", authMiddleware, requireStoreAdmin, controller.getById);
router.put("/:id", authMiddleware, requireStoreAdmin, controller.update);
router.delete("/:id", authMiddleware, requireStoreAdmin, controller.delete);

export default router;
