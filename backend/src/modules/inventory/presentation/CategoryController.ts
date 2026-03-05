import { Request, Response } from "express";
import { PrismaCategoryRepository } from "../infrastructure/PrismaCategoryRepository";
import { CreateCategoryUseCase } from "../application/CreateCategoryUseCase";
import { ListCategoriesUseCase } from "../application/ListCategoriesUseCase";
import { GetCategoryByIdUseCase } from "../application/GetCategoryByIdUseCase";
import { UpdateCategoryUseCase } from "../application/UpdateCategoryUseCase";
import { DeleteCategoryUseCase } from "../application/DeleteCategoryUseCase";
import { AppError } from "../../../shared/application/errors/AppError";

export class CategoryController {
  async create(req: any, res: Response) {
    try {
      const companyId = req.user?.companyId as string | null;
      if (!companyId) return res.status(403).json({ message: "No autorizado: usuario sin companyId" });

      const { nombre, descripcion } = req.body;

      const repo = new PrismaCategoryRepository();
      const useCase = new CreateCategoryUseCase(repo);

      const result = await useCase.execute({ companyId, nombre, descripcion });
      return res.status(201).json(result);
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(400).json({ message: error.message });
    }
  }

  async list(req: any, res: Response) {
    try {
      const companyId = req.user?.companyId as string | null;
      if (!companyId) return res.status(403).json({ message: "No autorizado: usuario sin companyId" });

      const repo = new PrismaCategoryRepository();
      const useCase = new ListCategoriesUseCase(repo);
      const result = await useCase.execute({ companyId });

      return res.status(200).json(result);
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(400).json({ message: error.message });
    }
  }

  async getById(req: any, res: Response) {
    try {
      const companyId = req.user?.companyId as string | null;
      if (!companyId) return res.status(403).json({ message: "No autorizado: usuario sin companyId" });

      const id = String(req.params.id);

      const repo = new PrismaCategoryRepository();
      const useCase = new GetCategoryByIdUseCase(repo);
      const result = await useCase.execute({ companyId, id });

      return res.status(200).json(result);
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(400).json({ message: error.message });
    }
  }

  async update(req: any, res: Response) {
    try {
      const companyId = req.user?.companyId as string | null;
      if (!companyId) return res.status(403).json({ message: "No autorizado: usuario sin companyId" });

      const id = String(req.params.id);
      const { nombre, descripcion, activo } = req.body;

      const repo = new PrismaCategoryRepository();
      const useCase = new UpdateCategoryUseCase(repo);
      const result = await useCase.execute({ companyId, id, nombre, descripcion, activo });

      return res.status(200).json(result);
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(400).json({ message: error.message });
    }
  }

  async delete(req: any, res: Response) {
    try {
      const companyId = req.user?.companyId as string | null;
      if (!companyId) return res.status(403).json({ message: "No autorizado: usuario sin companyId" });

      const id = String(req.params.id);

      const repo = new PrismaCategoryRepository();
      const useCase = new DeleteCategoryUseCase(repo);
      const result = await useCase.execute({ companyId, id });

      return res.status(200).json(result);
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(400).json({ message: error.message });
    }
  }
}
