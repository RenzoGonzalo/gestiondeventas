import { Router } from "express";
import { SuperAdminController } from "./SuperAdminController";
import { authMiddleware, requireSuperAdmin } from "../../../shared/infrastructure/auth/authMiddleware";

const router = Router();
const controller = new SuperAdminController();

router.post("/companies", authMiddleware, requireSuperAdmin, controller.provisionCompany);

export default router;
