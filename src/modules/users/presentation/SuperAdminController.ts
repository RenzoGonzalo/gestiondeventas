import { Request, Response } from "express";
import { ProvisionCompanyAndStoreAdminUseCase } from "../../../shared/application/ProvisionCompanyAndStoreAdminUseCase";
import { AppError } from "../../../shared/application/errors/AppError";
import { ListCompaniesUseCase } from "../../companies/application/ListCompaniesUseCase";
import { UpdateCompanyUseCase } from "../../companies/application/UpdateCompanyUseCase";

export class SuperAdminController {
  constructor(
    private readonly provisionCompanyAndStoreAdminUseCase: ProvisionCompanyAndStoreAdminUseCase,
    private readonly listCompaniesUseCase: ListCompaniesUseCase,
    private readonly updateCompanyUseCase: UpdateCompanyUseCase
  ) {}

  listCompanies = async (_req: Request, res: Response) => {
    try {
      const result = await this.listCompaniesUseCase.execute();
      return res.status(200).json(result);
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(400).json({ message: error.message });
    }
  };

  updateCompany = async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const name = (req.body as any)?.name ?? (req.body as any)?.nombre;
      const ruc = (req.body as any)?.ruc;
      const address = (req.body as any)?.address ?? (req.body as any)?.direccion;

      const result = await this.updateCompanyUseCase.execute({
        id,
        name: name === undefined ? undefined : String(name),
        ruc: ruc === undefined ? undefined : (ruc === null ? null : String(ruc)),
        address: address === undefined ? undefined : (address === null ? null : String(address))
      });

      return res.status(200).json(result);
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(400).json({ message: error.message });
    }
  };

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
