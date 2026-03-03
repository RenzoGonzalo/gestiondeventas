"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const PrismaUserRepository_1 = require("../infrastructure/PrismaUserRepository");
const PrismaRoleRepository_1 = require("../infrastructure/PrismaRoleRepository");
const BcryptPasswordService_1 = require("../infrastructure/services/BcryptPasswordService");
const JwtTokenService_1 = require("../infrastructure/services/JwtTokenService");
const RegisterUseCase_1 = require("../application/RegisterUseCase");
const LoginUseCase_1 = require("../application/LoginUseCase");
const PrismaCompanyRepository_1 = require("../../companies/infrastructure/PrismaCompanyRepository");
const ProvisionCompanyAndStoreAdminUseCase_1 = require("../../../shared/application/ProvisionCompanyAndStoreAdminUseCase");
const AppError_1 = require("../../../shared/application/errors/AppError");
class AuthController {
    async register(req, res) {
        try {
            const { email, password, roleName, companyId } = req.body;
            const userRepository = new PrismaUserRepository_1.PrismaUserRepository();
            const roleRepository = new PrismaRoleRepository_1.PrismaRoleRepository();
            const passwordService = new BcryptPasswordService_1.BcryptPasswordService();
            const useCase = new RegisterUseCase_1.RegisterUseCase(userRepository, roleRepository, passwordService);
            const result = await useCase.execute({
                email,
                password,
                roleName: roleName ?? "SELLER",
                companyId: companyId ?? null
            });
            return res.status(201).json(result);
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(400).json({ message: error.message });
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const userRepository = new PrismaUserRepository_1.PrismaUserRepository();
            const passwordService = new BcryptPasswordService_1.BcryptPasswordService();
            const tokenService = new JwtTokenService_1.JwtTokenService();
            const useCase = new LoginUseCase_1.LoginUseCase(userRepository, passwordService, tokenService);
            const result = await useCase.execute(email, password);
            return res.status(200).json(result);
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(401).json({ message: error.message });
        }
    }
    async provisionCompany(req, res) {
        try {
            const { company, admin } = req.body;
            const companyRepository = new PrismaCompanyRepository_1.PrismaCompanyRepository();
            const userRepository = new PrismaUserRepository_1.PrismaUserRepository();
            const roleRepository = new PrismaRoleRepository_1.PrismaRoleRepository();
            const passwordService = new BcryptPasswordService_1.BcryptPasswordService();
            const useCase = new ProvisionCompanyAndStoreAdminUseCase_1.ProvisionCompanyAndStoreAdminUseCase({
                companyRepository,
                userRepository,
                roleRepository,
                passwordService
            });
            const result = await useCase.execute({ company, admin });
            return res.status(201).json(result);
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(400).json({ message: error.message });
        }
    }
}
exports.AuthController = AuthController;
