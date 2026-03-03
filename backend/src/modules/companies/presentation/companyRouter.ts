import { Router } from "express";
import { CompanyController } from "./CompanyController";
import {
  authMiddleware,
  requireSameCompanyFromParam,
  requireStoreAdmin
} from "../../../shared/infrastructure/auth/authMiddleware";

const router = Router();
const controller = new CompanyController();

router.get(
  "/:companyId",
  authMiddleware,
  requireStoreAdmin,
  requireSameCompanyFromParam("companyId"),
  controller.getById
);

export default router;
