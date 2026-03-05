"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VariantController = void 0;
const PrismaVariantRepository_1 = require("../infrastructure/PrismaVariantRepository");
const AddVariantToProductUseCase_1 = require("../application/AddVariantToProductUseCase");
const UpdateVariantUseCase_1 = require("../application/UpdateVariantUseCase");
const DeleteVariantUseCase_1 = require("../application/DeleteVariantUseCase");
const AdjustVariantStockUseCase_1 = require("../application/AdjustVariantStockUseCase");
const AppError_1 = require("../../../shared/application/errors/AppError");
class VariantController {
    async addToProduct(req, res) {
        try {
            const companyId = req.user?.companyId;
            const userId = req.user?.id;
            if (!companyId)
                return res.status(403).json({ message: "No autorizado: usuario sin companyId" });
            if (!userId)
                return res.status(401).json({ message: "Token missing" });
            const productId = String(req.params.id);
            const body = req.body;
            const repo = new PrismaVariantRepository_1.PrismaVariantRepository();
            const useCase = new AddVariantToProductUseCase_1.AddVariantToProductUseCase(repo);
            const result = await useCase.execute({
                companyId,
                productId,
                creadoPor: userId,
                nombre: body.nombre,
                sku: body.sku,
                codigoBarras: body.codigoBarras,
                atributos: body.atributos,
                unitType: body.unitType,
                precioCompra: body.precioCompra,
                precioVenta: body.precioVenta,
                stockActual: body.stockActual,
                stockMinimo: body.stockMinimo,
                ubicacion: body.ubicacion,
                activo: body.activo
            });
            return res.status(201).json(result);
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(400).json({ message: error.message });
        }
    }
    async update(req, res) {
        try {
            const companyId = req.user?.companyId;
            if (!companyId)
                return res.status(403).json({ message: "No autorizado: usuario sin companyId" });
            const id = String(req.params.id);
            const body = req.body;
            const repo = new PrismaVariantRepository_1.PrismaVariantRepository();
            const useCase = new UpdateVariantUseCase_1.UpdateVariantUseCase(repo);
            const result = await useCase.execute({
                companyId,
                id,
                nombre: body.nombre,
                sku: body.sku,
                codigoBarras: body.codigoBarras,
                atributos: body.atributos,
                unitType: body.unitType,
                precioCompra: body.precioCompra,
                precioVenta: body.precioVenta,
                stockMinimo: body.stockMinimo,
                ubicacion: body.ubicacion,
                activo: body.activo
            });
            return res.status(200).json(result);
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(400).json({ message: error.message });
        }
    }
    async delete(req, res) {
        try {
            const companyId = req.user?.companyId;
            if (!companyId)
                return res.status(403).json({ message: "No autorizado: usuario sin companyId" });
            const id = String(req.params.id);
            const repo = new PrismaVariantRepository_1.PrismaVariantRepository();
            const useCase = new DeleteVariantUseCase_1.DeleteVariantUseCase(repo);
            const result = await useCase.execute({ companyId, id });
            return res.status(200).json(result);
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(400).json({ message: error.message });
        }
    }
    async adjustStock(req, res) {
        try {
            const companyId = req.user?.companyId;
            const userId = req.user?.id;
            if (!companyId)
                return res.status(403).json({ message: "No autorizado: usuario sin companyId" });
            if (!userId)
                return res.status(401).json({ message: "Token missing" });
            const variantId = String(req.params.id);
            const { cantidad, motivo } = req.body;
            const repo = new PrismaVariantRepository_1.PrismaVariantRepository();
            const useCase = new AdjustVariantStockUseCase_1.AdjustVariantStockUseCase(repo);
            const result = await useCase.execute({
                companyId,
                variantId,
                cantidad: String(cantidad),
                motivo,
                usuarioId: userId
            });
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
exports.VariantController = VariantController;
