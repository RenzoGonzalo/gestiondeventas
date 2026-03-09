"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SellersController_1 = require("./SellersController");
const authMiddleware_1 = require("../../../shared/infrastructure/auth/authMiddleware");
const router = (0, express_1.Router)();
const controller = new SellersController_1.SellersController();
router.post("/", authMiddleware_1.authMiddleware, authMiddleware_1.requireStoreAdmin, controller.create);
exports.default = router;
