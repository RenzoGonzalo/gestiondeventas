import { Request, Response } from "express";
import { GetCompanyByIdUseCase } from "../application/GetCompanyByIdUseCase";
import { AppError } from "../../../shared/application/errors/AppError";
import { AuthRequest } from "../../../shared/infrastructure/auth/authMiddleware";

export class CompanyController {
  constructor(private readonly getCompanyByIdUseCase: GetCompanyByIdUseCase) {}

  getMe = async (req: AuthRequest, res: Response) => {
    try {
      const companyId: string | null | undefined = req.user?.companyId;

      if (!companyId) {
        return res.status(403).json({ message: "No autorizado: usuario sin companyId" });
      }

      const result = await this.getCompanyByIdUseCase.execute(String(companyId));

      return res.status(200).json(result);
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(400).json({ message: error.message });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const companyId = String(req.params.companyId);

      const result = await this.getCompanyByIdUseCase.execute(companyId);

      return res.status(200).json(result);
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(400).json({ message: error.message });
    }
  };
}
