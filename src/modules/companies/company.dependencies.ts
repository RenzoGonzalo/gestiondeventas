import { PrismaCompanyRepository } from "./infrastructure/PrismaCompanyRepository";

import { GetCompanyByIdUseCase } from "./application/GetCompanyByIdUseCase";

import { CompanyController } from "./presentation/CompanyController";

// --- Repositorios (Infra) ---
const companyRepository = new PrismaCompanyRepository();

// --- Use cases (Application) ---
const getCompanyByIdUseCase = new GetCompanyByIdUseCase(companyRepository);

// --- Controllers (Presentation) ---
export const companyController = new CompanyController(getCompanyByIdUseCase);
