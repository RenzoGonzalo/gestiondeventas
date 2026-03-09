"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SellersController = void 0;
const CreateSellerUseCase_1 = require("../application/CreateSellerUseCase");
const PrismaRoleRepository_1 = require("../infrastructure/PrismaRoleRepository");
const PrismaUserRepository_1 = require("../infrastructure/PrismaUserRepository");
const BcryptPasswordService_1 = require("../infrastructure/services/BcryptPasswordService");
const AppError_1 = require("../../../shared/application/errors/AppError");
class SellersController {
    async create(req, res) {
        try {
            const companyId = req.user?.companyId;
            if (!companyId)
                return res.status(403).json({ message: "No autorizado: usuario sin companyId" });
            const { email, password, nombre } = req.body;
            const userRepository = new PrismaUserRepository_1.PrismaUserRepository();
            const roleRepository = new PrismaRoleRepository_1.PrismaRoleRepository();
            const passwordService = new BcryptPasswordService_1.BcryptPasswordService();
            const useCase = new CreateSellerUseCase_1.CreateSellerUseCase(userRepository, roleRepository, passwordService);
            const result = await useCase.execute({
                companyId,
                email,
                password,
                nombre
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
exports.SellersController = SellersController;
