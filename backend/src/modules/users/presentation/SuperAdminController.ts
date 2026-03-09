import { Request, Response } from "express";
import { PrismaCompanyRepository } from "../../companies/infrastructure/PrismaCompanyRepository";
import { PrismaRoleRepository } from "../infrastructure/PrismaRoleRepository";
import { PrismaUserRepository } from "../infrastructure/PrismaUserRepository";
import { BcryptPasswordService } from "../infrastructure/services/BcryptPasswordService";
import { ProvisionCompanyAndStoreAdminUseCase } from "../../../shared/application/ProvisionCompanyAndStoreAdminUseCase";
import { AppError } from "../../../shared/application/errors/AppError";

export class SuperAdminController {
  async provisionCompany(req: Request, res: Response) {
    try {
      const { company, admin } = req.body;

      const companyInput = {
        name: company?.name ?? company?.nombre,
        ruc: company?.ruc ?? null,
        address: company?.address ?? company?.direccion ?? null
      };

      const adminInput = {
        email: admin?.email,
        password: admin?.password,
        nombre: admin?.nombre
      };

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

      const result = await useCase.execute({
        company: companyInput,
        admin: adminInput
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
