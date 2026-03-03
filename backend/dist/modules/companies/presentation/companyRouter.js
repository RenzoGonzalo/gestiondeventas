"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CompanyController_1 = require("./CompanyController");
const authMiddleware_1 = require("../../../shared/infrastructure/auth/authMiddleware");
const router = (0, express_1.Router)();
const controller = new CompanyController_1.CompanyController();
router.get("/:companyId", authMiddleware_1.authMiddleware, authMiddleware_1.requireStoreAdmin, (0, authMiddleware_1.requireSameCompanyFromParam)("companyId"), controller.getById);
exports.default = router;
