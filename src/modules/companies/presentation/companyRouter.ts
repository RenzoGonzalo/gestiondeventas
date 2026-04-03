import { Router } from "express";
import {
  authMiddleware,
  requireAnyRole,
  requireSameCompanyFromParam,
  requireStoreAdmin
} from "../../../shared/infrastructure/auth/authMiddleware";
import { companyController } from "../company.dependencies";

const router = Router();

router.get(
  "/me",
  authMiddleware,
  requireAnyRole(["STORE_ADMIN", "SELLER"]),
  companyController.getMe
);

router.get(
  "/:companyId",
  authMiddleware,
  requireStoreAdmin,
  requireSameCompanyFromParam("companyId"),
  companyController.getById
);

export default router;
