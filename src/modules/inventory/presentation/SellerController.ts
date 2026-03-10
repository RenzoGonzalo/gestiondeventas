import { Response } from "express";
import { SellerListProductsUseCase } from "../application/SellerListProductsUseCase";
import { SellerSearchProductsUseCase } from "../application/SellerSearchProductsUseCase";
import { AppError } from "../../../shared/application/errors/AppError";

export class SellerController {
  constructor(
    private readonly sellerListProductsUseCase: SellerListProductsUseCase,
    private readonly sellerSearchProductsUseCase: SellerSearchProductsUseCase
  ) {}

  list = async (req: any, res: Response) => {
    try {
      const companyId = req.user?.companyId as string | null;
      if (!companyId) return res.status(403).json({ message: "No autorizado: usuario sin companyId" });

      const result = await this.sellerListProductsUseCase.execute({ companyId });

      return res.status(200).json(result);
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(400).json({ message: error.message });
    }
  };

  search = async (req: any, res: Response) => {
    try {
      const companyId = req.user?.companyId as string | null;
      if (!companyId) return res.status(403).json({ message: "No autorizado: usuario sin companyId" });

      const q = req.query.q ? String(req.query.q) : "";

      const result = await this.sellerSearchProductsUseCase.execute({ companyId, q });

      return res.status(200).json(result);
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(400).json({ message: error.message });
    }
  };
}
