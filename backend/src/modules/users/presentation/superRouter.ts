import { Router } from "express";
import { authMiddleware, requireSuperAdmin } from "../../../shared/infrastructure/auth/authMiddleware";
import { superAdminController } from "../user.dependencies";

const router = Router();

router.post(
	"/companies",
	authMiddleware,
	requireSuperAdmin,
	superAdminController.provisionCompany
);

export default router;
