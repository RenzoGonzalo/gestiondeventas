import { Router } from "express";
import { sellerLoginRateLimit } from "../../../shared/infrastructure/auth/authMiddleware";
import { authController } from "../user.dependencies";

const router = Router();

router.post("/login", authController.login);
router.post("/seller-login", sellerLoginRateLimit, authController.sellerLogin);
router.post("/google-login", authController.googleLogin);
router.post("/resend-verification", authController.resendVerificationEmail);
router.get("/verify-email", authController.verifyEmail);
// router.post("/login_seller", authController.sellerLogin);

// prueba para verificar el middleware. En producción, esta ruta no debería existir o estar protegida de otra forma.

/* router.get("/me", authMiddleware, (req: any, res) => {
  res.json({
    message: "Access granted",
    user: req.user
  });
});*/

export default router;
