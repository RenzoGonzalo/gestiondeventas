import { Request, Response } from "express";
import { CreateSellerUseCase } from "../application/CreateSellerUseCase";
import { PrismaRoleRepository } from "../infrastructure/PrismaRoleRepository";
import { PrismaUserRepository } from "../infrastructure/PrismaUserRepository";
import { BcryptPasswordService } from "../infrastructure/services/BcryptPasswordService";
import { AppError } from "../../../shared/application/errors/AppError";

export class SellersController {
  async create(req: any, res: Response) {
    try {
      const companyId = req.user?.companyId as string | null;
      if (!companyId) return res.status(403).json({ message: "No autorizado: usuario sin companyId" });

      const { email, password, nombre } = req.body;

      const userRepository = new PrismaUserRepository();
      const roleRepository = new PrismaRoleRepository();
      const passwordService = new BcryptPasswordService();

      const useCase = new CreateSellerUseCase(
        userRepository,
        roleRepository,
        passwordService
      );

      const result = await useCase.execute({
        companyId,
        email,
        password,
        nombre
      });

      return res.status(201).json(result);
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(400).json({ message: error.message });
    }
  }
}
