import { PrismaCompanyRepository } from "../companies/infrastructure/PrismaCompanyRepository";

import { LoginUseCase } from "./application/LoginUseCase";
import { LoginWithGoogleUseCase } from "./application/LoginWithGoogleUseCase";
import { ResendSuperAdminVerificationEmailUseCase } from "./application/ResendSuperAdminVerificationEmailUseCase";
import { SellerCodeLoginUseCase } from "./application/SellerCodeLoginUseCase";
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
const loginWithGoogleUseCase = new LoginWithGoogleUseCase(userRepository, tokenService, companyRepository);
const resendSuperAdminVerificationEmailUseCase = new ResendSuperAdminVerificationEmailUseCase(userRepository);
const sellerCodeLoginUseCase = new SellerCodeLoginUseCase(userRepository, tokenService, companyRepository);

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
export const authController = new AuthController(
  loginUseCase,
  loginWithGoogleUseCase,
  resendSuperAdminVerificationEmailUseCase,
  sellerCodeLoginUseCase,
  userRepository
);
export const sellersController = new SellersController(createSellerUseCase);
export const superAdminController = new SuperAdminController(
  provisionCompanyAndStoreAdminUseCase,
  listCompaniesUseCase,
  updateCompanyUseCase
);
