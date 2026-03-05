"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const PrismaProductRepository_1 = require("../infrastructure/PrismaProductRepository");
const PrismaVariantRepository_1 = require("../infrastructure/PrismaVariantRepository");
const CreateProductUseCase_1 = require("../application/CreateProductUseCase");
const ListProductsUseCase_1 = require("../application/ListProductsUseCase");
const GetProductByIdUseCase_1 = require("../application/GetProductByIdUseCase");
const UpdateProductUseCase_1 = require("../application/UpdateProductUseCase");
const DeleteProductUseCase_1 = require("../application/DeleteProductUseCase");
const AppError_1 = require("../../../shared/application/errors/AppError");
class ProductController {
    async create(req, res) {
        try {
            const companyId = req.user?.companyId;
            const userId = req.user?.id;
            if (!companyId)
                return res.status(403).json({ message: "No autorizado: usuario sin companyId" });
            if (!userId)
                return res.status(401).json({ message: "Token missing" });
            const body = req.body;
            const productRepo = new PrismaProductRepository_1.PrismaProductRepository();
            const variantRepo = new PrismaVariantRepository_1.PrismaVariantRepository();
            const useCase = new CreateProductUseCase_1.CreateProductUseCase(productRepo, variantRepo);
            const result = await useCase.execute({
                companyId,
                creadoPor: userId,
                categoryId: body.categoryId,
                nombre: body.nombre,
                descripcion: body.descripcion,
                imagen: body.imagen,
                activo: body.activo,
                atributos: body.atributos,
                unitType: body.unitType,
                variantes: body.variantes ?? []
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
    async list(req, res) {
        try {
            const companyId = req.user?.companyId;
            if (!companyId)
                return res.status(403).json({ message: "No autorizado: usuario sin companyId" });
            const categoryId = req.query.categoryId ? String(req.query.categoryId) : undefined;
            const productRepo = new PrismaProductRepository_1.PrismaProductRepository();
            const useCase = new ListProductsUseCase_1.ListProductsUseCase(productRepo);
            const result = await useCase.execute({ companyId, categoryId });
            return res.status(200).json(result);
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(400).json({ message: error.message });
        }
    }
    async getById(req, res) {
        try {
            const companyId = req.user?.companyId;
            if (!companyId)
                return res.status(403).json({ message: "No autorizado: usuario sin companyId" });
            const id = String(req.params.id);
            const productRepo = new PrismaProductRepository_1.PrismaProductRepository();
            const variantRepo = new PrismaVariantRepository_1.PrismaVariantRepository();
            const useCase = new GetProductByIdUseCase_1.GetProductByIdUseCase(productRepo, variantRepo);
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
    async update(req, res) {
        try {
            const companyId = req.user?.companyId;
            if (!companyId)
                return res.status(403).json({ message: "No autorizado: usuario sin companyId" });
            const id = String(req.params.id);
            const body = req.body;
            const productRepo = new PrismaProductRepository_1.PrismaProductRepository();
            const useCase = new UpdateProductUseCase_1.UpdateProductUseCase(productRepo);
            const result = await useCase.execute({
                companyId,
                id,
                nombre: body.nombre,
                descripcion: body.descripcion,
                imagen: body.imagen,
                activo: body.activo,
                atributos: body.atributos,
                unitType: body.unitType,
                categoryId: body.categoryId
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
            const productRepo = new PrismaProductRepository_1.PrismaProductRepository();
            const useCase = new DeleteProductUseCase_1.DeleteProductUseCase(productRepo);
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
}
exports.ProductController = ProductController;
