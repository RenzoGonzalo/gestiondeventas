"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SellerController = void 0;
const PrismaVariantRepository_1 = require("../infrastructure/PrismaVariantRepository");
const SellerListProductsUseCase_1 = require("../application/SellerListProductsUseCase");
const SellerSearchProductsUseCase_1 = require("../application/SellerSearchProductsUseCase");
const AppError_1 = require("../../../shared/application/errors/AppError");
class SellerController {
    async list(req, res) {
        try {
            const companyId = req.user?.companyId;
            if (!companyId)
                return res.status(403).json({ message: "No autorizado: usuario sin companyId" });
            const repo = new PrismaVariantRepository_1.PrismaVariantRepository();
            const useCase = new SellerListProductsUseCase_1.SellerListProductsUseCase(repo);
            const result = await useCase.execute({ companyId });
            return res.status(200).json(result);
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(400).json({ message: error.message });
        }
    }
    async search(req, res) {
        try {
            const companyId = req.user?.companyId;
            if (!companyId)
                return res.status(403).json({ message: "No autorizado: usuario sin companyId" });
            const q = req.query.q ? String(req.query.q) : "";
            const repo = new PrismaVariantRepository_1.PrismaVariantRepository();
            const useCase = new SellerSearchProductsUseCase_1.SellerSearchProductsUseCase(repo);
            const result = await useCase.execute({ companyId, q });
            return res.status(200).json(result);
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(400).json({ message: error.message });
        }
    }
}
exports.SellerController = SellerController;
