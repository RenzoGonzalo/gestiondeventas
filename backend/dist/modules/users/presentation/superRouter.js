"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SuperAdminController_1 = require("./SuperAdminController");
const authMiddleware_1 = require("../../../shared/infrastructure/auth/authMiddleware");
const router = (0, express_1.Router)();
const controller = new SuperAdminController_1.SuperAdminController();
router.post("/companies", authMiddleware_1.authMiddleware, authMiddleware_1.requireSuperAdmin, controller.provisionCompany);
exports.default = router;
