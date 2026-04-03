import { Router } from "express";
import { authMiddleware, requireAnyRole } from "../../../shared/infrastructure/auth/authMiddleware";
import { sellerController } from "../inventory.dependencies";

const router = Router();

router.get("/products", authMiddleware, requireAnyRole(["STORE_ADMIN", "SELLER"]), sellerController.list);
router.get(
  "/products/search",
  authMiddleware,
  requireAnyRole(["STORE_ADMIN", "SELLER"]),
  sellerController.search
);

export default router;
