import { Request, Response } from "express";
import { ProvisionCompanyAndStoreAdminUseCase } from "../../../shared/application/ProvisionCompanyAndStoreAdminUseCase";
import { AppError } from "../../../shared/application/errors/AppError";

export class SuperAdminController {
  constructor(
    private readonly provisionCompanyAndStoreAdminUseCase: ProvisionCompanyAndStoreAdminUseCase
  ) {}

  provisionCompany = async (req: Request, res: Response) => {
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

      const result = await this.provisionCompanyAndStoreAdminUseCase.execute({
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
  };
}
