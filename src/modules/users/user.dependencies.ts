import { PrismaCompanyRepository } from "../companies/infrastructure/PrismaCompanyRepository";

import { LoginUseCase } from "./application/LoginUseCase";
import { CreateSellerUseCase } from "./application/CreateSellerUseCase";

import { PrismaUserRepository } from "./infrastructure/PrismaUserRepository";
import { PrismaRoleRepository } from "./infrastructure/PrismaRoleRepository";
import { BcryptPasswordService } from "./infrastructure/services/BcryptPasswordService";
import { JwtTokenService } from "./infrastructure/services/JwtTokenService";

import { AuthController } from "./presentation/AuthController";
import { SellersController } from "./presentation/SellersController";
import { SuperAdminController } from "./presentation/SuperAdminController";
import { ListCompaniesUseCase } from "../companies/application/ListCompaniesUseCase";
import { UpdateCompanyUseCase } from "../companies/application/UpdateCompanyUseCase";

import { ProvisionCompanyAndStoreAdminUseCase } from "../../shared/application/ProvisionCompanyAndStoreAdminUseCase";

// --- Repositorios / Servicios (Infra) ---
const userRepository = new PrismaUserRepository();
const roleRepository = new PrismaRoleRepository();
const passwordService = new BcryptPasswordService();
const tokenService = new JwtTokenService();

const companyRepository = new PrismaCompanyRepository();

// --- Use cases (Application) ---
const loginUseCase = new LoginUseCase(userRepository, passwordService, tokenService, companyRepository);

const createSellerUseCase = new CreateSellerUseCase(
  userRepository,
  roleRepository,
  passwordService
);

// (ProvisionCompanyAndStoreAdminUseCase ya orquesta casos de uso internos)
const provisionCompanyAndStoreAdminUseCase = new ProvisionCompanyAndStoreAdminUseCase({
  companyRepository,
  userRepository,
  roleRepository,
  passwordService
});

const listCompaniesUseCase = new ListCompaniesUseCase(companyRepository);
const updateCompanyUseCase = new UpdateCompanyUseCase(companyRepository);

// --- Controllers (Presentation) ---
export const authController = new AuthController(loginUseCase);
export const sellersController = new SellersController(createSellerUseCase);
export const superAdminController = new SuperAdminController(
  provisionCompanyAndStoreAdminUseCase,
  listCompaniesUseCase,
  updateCompanyUseCase
);
