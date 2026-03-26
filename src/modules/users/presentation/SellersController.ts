import { Request, Response } from "express";
import { CreateSellerUseCase } from "../application/CreateSellerUseCase";
import { AppError } from "../../../shared/application/errors/AppError";

export class SellersController {
  constructor(private readonly createSellerUseCase: CreateSellerUseCase) {}

  create = async (req: Request & { user?: any }, res: Response) => {
    try {
      const companyId = req.user?.companyId as string | null;
      if (!companyId) return res.status(403).json({ message: "No autorizado: usuario sin companyId" });

      const { code, nombre } = req.body;
      const result = await this.createSellerUseCase.execute({
        companyId,
        code,
        nombre
      });

      return res.status(201).json(result);
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(400).json({ message: error.message });
    }
  };
}
