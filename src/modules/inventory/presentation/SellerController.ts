import { Response } from "express";
import { PrismaVariantRepository } from "../infrastructure/PrismaVariantRepository";
import { SellerListProductsUseCase } from "../application/SellerListProductsUseCase";
import { SellerSearchProductsUseCase } from "../application/SellerSearchProductsUseCase";
import { AppError } from "../../../shared/application/errors/AppError";

export class SellerController {
  async list(req: any, res: Response) {
    try {
      const companyId = req.user?.companyId as string | null;
      if (!companyId) return res.status(403).json({ message: "No autorizado: usuario sin companyId" });

      const repo = new PrismaVariantRepository();
      const useCase = new SellerListProductsUseCase(repo);
      const result = await useCase.execute({ companyId });

      return res.status(200).json(result);
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(400).json({ message: error.message });
    }
  }

  async search(req: any, res: Response) {
    try {
      const companyId = req.user?.companyId as string | null;
      if (!companyId) return res.status(403).json({ message: "No autorizado: usuario sin companyId" });

      const q = req.query.q ? String(req.query.q) : "";

      const repo = new PrismaVariantRepository();
      const useCase = new SellerSearchProductsUseCase(repo);
      const result = await useCase.execute({ companyId, q });

      return res.status(200).json(result);
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(400).json({ message: error.message });
    }
  }
}
