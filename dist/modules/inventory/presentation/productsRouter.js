"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProductController_1 = require("./ProductController");
const VariantController_1 = require("./VariantController");
const authMiddleware_1 = require("../../../shared/infrastructure/auth/authMiddleware");
const router = (0, express_1.Router)();
const productController = new ProductController_1.ProductController();
const variantController = new VariantController_1.VariantController();
router.post("/", authMiddleware_1.authMiddleware, authMiddleware_1.requireStoreAdmin, productController.create);
router.get("/", authMiddleware_1.authMiddleware, authMiddleware_1.requireStoreAdmin, productController.list);
router.get("/:id", authMiddleware_1.authMiddleware, authMiddleware_1.requireStoreAdmin, productController.getById);
router.put("/:id", authMiddleware_1.authMiddleware, authMiddleware_1.requireStoreAdmin, productController.update);
router.delete("/:id", authMiddleware_1.authMiddleware, authMiddleware_1.requireStoreAdmin, productController.delete);
// Variantes bajo un producto
router.post("/:id/variants", authMiddleware_1.authMiddleware, authMiddleware_1.requireStoreAdmin, variantController.addToProduct);
exports.default = router;
