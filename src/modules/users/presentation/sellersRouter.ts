import { Router } from "express";
import { authMiddleware, requireStoreAdmin } from "../../../shared/infrastructure/auth/authMiddleware";
import { sellersController } from "../user.dependencies";

const router = Router();

router.get("/", authMiddleware, requireStoreAdmin, sellersController.list);
router.post("/", authMiddleware, requireStoreAdmin, sellersController.create);

export default router;
