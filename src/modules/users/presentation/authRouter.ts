import { Router } from "express";
import { AuthController } from "./AuthController";
import { authMiddleware, requireSuperAdmin } from "../../../shared/infrastructure/auth/authMiddleware";

const router = Router();
const controller = new AuthController();

router.post("/register", authMiddleware, requireSuperAdmin, controller.register);
router.post("/login", controller.login);
router.post(
  "/provision-company",
  authMiddleware,
  requireSuperAdmin,
  controller.provisionCompany
);

// prueba para verificar el middleware. En producción, esta ruta no debería existir o estar protegida de otra forma.
router.get("/me", authMiddleware, (req: any, res) => {
  res.json({
    message: "Access granted",
    user: req.user
  });
});

export default router;