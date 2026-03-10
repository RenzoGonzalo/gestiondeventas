import { Router } from "express";
import {
  authMiddleware,
  requireSameCompanyFromParam,
  requireStoreAdmin
} from "../../../shared/infrastructure/auth/authMiddleware";
import { companyController } from "../company.dependencies";

const router = Router();

router.get(
  "/:companyId",
  authMiddleware,
  requireStoreAdmin,
  requireSameCompanyFromParam("companyId"),
  companyController.getById
);

export default router;
