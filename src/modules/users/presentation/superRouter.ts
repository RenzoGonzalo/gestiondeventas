import { Router } from "express";
import { authMiddleware, requireSuperAdmin } from "../../../shared/infrastructure/auth/authMiddleware";
import { superAdminController } from "../user.dependencies";

const router = Router();

router.get(
	"/companies",
	authMiddleware,
	requireSuperAdmin,
	superAdminController.listCompanies
);

router.post(
	"/companies",
	authMiddleware,
	requireSuperAdmin,
	superAdminController.provisionCompany
);

router.put(
	"/companies/:id",
	authMiddleware,
	requireSuperAdmin,
	superAdminController.updateCompany
);

export default router;
