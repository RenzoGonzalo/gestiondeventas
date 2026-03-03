import { Request, Response } from "express";
import { PrismaCompanyRepository } from "../infrastructure/PrismaCompanyRepository";
import { GetCompanyByIdUseCase } from "../application/GetCompanyByIdUseCase";
import { AppError } from "../../../shared/application/errors/AppError";

export class CompanyController {
  async getById(req: Request, res: Response) {
    try {
      const companyId = String(req.params.companyId);

      const companyRepository = new PrismaCompanyRepository();
      const useCase = new GetCompanyByIdUseCase(companyRepository);

      const result = await useCase.execute(companyId);

      return res.status(200).json(result);
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(400).json({ message: error.message });
    }
  }
}
