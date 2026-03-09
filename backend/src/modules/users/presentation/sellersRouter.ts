import { Router } from "express";
import { SellersController } from "./SellersController";
import { authMiddleware, requireStoreAdmin } from "../../../shared/infrastructure/auth/authMiddleware";

const router = Router();
const controller = new SellersController();

router.post("/", authMiddleware, requireStoreAdmin, controller.create);

export default router;
