import { Request, Response } from "express";
import { PrismaUserRepository } from "../infrastructure/PrismaUserRepository";
import { PrismaRoleRepository } from "../infrastructure/PrismaRoleRepository";
import { BcryptPasswordService } from "../infrastructure/services/BcryptPasswordService";
import { JwtTokenService } from "../infrastructure/services/JwtTokenService";
import { RegisterUseCase } from "../application/RegisterUseCase";
import { LoginUseCase } from "../application/LoginUseCase";
import { PrismaCompanyRepository } from "../../companies/infrastructure/PrismaCompanyRepository";
import { ProvisionCompanyAndStoreAdminUseCase } from "../../../shared/application/ProvisionCompanyAndStoreAdminUseCase";
import { AppError } from "../../../shared/application/errors/AppError";

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { email, password, roleName, companyId } = req.body;

      const userRepository = new PrismaUserRepository();
      const roleRepository = new PrismaRoleRepository();
      const passwordService = new BcryptPasswordService();

      const useCase = new RegisterUseCase(
        userRepository,
        roleRepository,
        passwordService
      );

      const result = await useCase.execute({
        email,
        password,
        roleName: roleName ?? "SELLER",
        companyId: companyId ?? null
      });

      return res.status(201).json(result);
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(400).json({ message: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const userRepository = new PrismaUserRepository();
      const passwordService = new BcryptPasswordService();
      const tokenService = new JwtTokenService();

      const useCase = new LoginUseCase(
        userRepository,
        passwordService,
        tokenService
      );

      const result = await useCase.execute(email, password);

      return res.status(200).json(result);
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(401).json({ message: error.message });
    }
  }

  async provisionCompany(req: Request, res: Response) {
    try {
      const { company, admin } = req.body;

      const companyRepository = new PrismaCompanyRepository();
      const userRepository = new PrismaUserRepository();
      const roleRepository = new PrismaRoleRepository();
      const passwordService = new BcryptPasswordService();

      const useCase = new ProvisionCompanyAndStoreAdminUseCase({
        companyRepository,
        userRepository,
        roleRepository,
        passwordService
      });

      const result = await useCase.execute({ company, admin });

      return res.status(201).json(result);
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(400).json({ message: error.message });
    }
  }
}
