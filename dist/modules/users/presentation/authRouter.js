"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("./AuthController");
const authMiddleware_1 = require("../../../shared/infrastructure/auth/authMiddleware");
const router = (0, express_1.Router)();
const controller = new AuthController_1.AuthController();
router.post("/login", controller.login);
router.post("/seller-login", controller.sellerLogin);
// prueba para verificar el middleware. En producción, esta ruta no debería existir o estar protegida de otra forma.
router.get("/me", authMiddleware_1.authMiddleware, (req, res) => {
    res.json({
        message: "Access granted",
        user: req.user
    });
});
exports.default = router;
