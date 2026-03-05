import { Router } from "express";
import { SellerController } from "./SellerController";
import { authMiddleware, requireAnyRole } from "../../../shared/infrastructure/auth/authMiddleware";

const router = Router();
const controller = new SellerController();

router.get("/products", authMiddleware, requireAnyRole(["STORE_ADMIN", "SELLER"]), controller.list);
router.get(
  "/products/search",
  authMiddleware,
  requireAnyRole(["STORE_ADMIN", "SELLER"]),
  controller.search
);

export default router;
