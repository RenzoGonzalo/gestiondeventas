"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const PrismaCategoryRepository_1 = require("../infrastructure/PrismaCategoryRepository");
const CreateCategoryUseCase_1 = require("../application/CreateCategoryUseCase");
const ListCategoriesUseCase_1 = require("../application/ListCategoriesUseCase");
const GetCategoryByIdUseCase_1 = require("../application/GetCategoryByIdUseCase");
const UpdateCategoryUseCase_1 = require("../application/UpdateCategoryUseCase");
const DeleteCategoryUseCase_1 = require("../application/DeleteCategoryUseCase");
const AppError_1 = require("../../../shared/application/errors/AppError");
class CategoryController {
    async create(req, res) {
        try {
            const companyId = req.user?.companyId;
            if (!companyId)
                return res.status(403).json({ message: "No autorizado: usuario sin companyId" });
            const { nombre, descripcion } = req.body;
            const repo = new PrismaCategoryRepository_1.PrismaCategoryRepository();
            const useCase = new CreateCategoryUseCase_1.CreateCategoryUseCase(repo);
            const result = await useCase.execute({ companyId, nombre, descripcion });
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
            const repo = new PrismaCategoryRepository_1.PrismaCategoryRepository();
            const useCase = new ListCategoriesUseCase_1.ListCategoriesUseCase(repo);
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
    async getById(req, res) {
        try {
            const companyId = req.user?.companyId;
            if (!companyId)
                return res.status(403).json({ message: "No autorizado: usuario sin companyId" });
            const id = String(req.params.id);
            const repo = new PrismaCategoryRepository_1.PrismaCategoryRepository();
            const useCase = new GetCategoryByIdUseCase_1.GetCategoryByIdUseCase(repo);
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
            const { nombre, descripcion, activo } = req.body;
            const repo = new PrismaCategoryRepository_1.PrismaCategoryRepository();
            const useCase = new UpdateCategoryUseCase_1.UpdateCategoryUseCase(repo);
            const result = await useCase.execute({ companyId, id, nombre, descripcion, activo });
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
            const repo = new PrismaCategoryRepository_1.PrismaCategoryRepository();
            const useCase = new DeleteCategoryUseCase_1.DeleteCategoryUseCase(repo);
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
exports.CategoryController = CategoryController;
