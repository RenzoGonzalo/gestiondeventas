"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperAdminController = void 0;
const PrismaCompanyRepository_1 = require("../../companies/infrastructure/PrismaCompanyRepository");
const PrismaRoleRepository_1 = require("../infrastructure/PrismaRoleRepository");
const PrismaUserRepository_1 = require("../infrastructure/PrismaUserRepository");
const BcryptPasswordService_1 = require("../infrastructure/services/BcryptPasswordService");
const ProvisionCompanyAndStoreAdminUseCase_1 = require("../../../shared/application/ProvisionCompanyAndStoreAdminUseCase");
const AppError_1 = require("../../../shared/application/errors/AppError");
class SuperAdminController {
    async provisionCompany(req, res) {
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
            const result = await useCase.execute({
                company: companyInput,
                admin: adminInput
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
}
exports.SuperAdminController = SuperAdminController;
