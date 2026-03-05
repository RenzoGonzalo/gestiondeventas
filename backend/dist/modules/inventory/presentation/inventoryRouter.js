"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoriesRouter_1 = __importDefault(require("./categoriesRouter"));
const productsRouter_1 = __importDefault(require("./productsRouter"));
const variantsRouter_1 = __importDefault(require("./variantsRouter"));
const sellerRouter_1 = __importDefault(require("./sellerRouter"));
const router = (0, express_1.Router)();
router.use("/categories", categoriesRouter_1.default);
router.use("/products", productsRouter_1.default);
router.use("/variants", variantsRouter_1.default);
router.use("/seller", sellerRouter_1.default);
exports.default = router;
