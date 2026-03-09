"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const PrismaUserRepository_1 = require("../infrastructure/PrismaUserRepository");
const BcryptPasswordService_1 = require("../infrastructure/services/BcryptPasswordService");
const JwtTokenService_1 = require("../infrastructure/services/JwtTokenService");
const LoginUseCase_1 = require("../application/LoginUseCase");
const AppError_1 = require("../../../shared/application/errors/AppError");
class AuthController {
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const userRepository = new PrismaUserRepository_1.PrismaUserRepository();
            const passwordService = new BcryptPasswordService_1.BcryptPasswordService();
            const tokenService = new JwtTokenService_1.JwtTokenService();
            const useCase = new LoginUseCase_1.LoginUseCase(userRepository, passwordService, tokenService);
            const result = await useCase.execute(email, password, {
                allowedRoles: ["SUPER_ADMIN", "STORE_ADMIN"]
            });
            return res.status(200).json(result);
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(401).json({ message: error.message });
        }
    }
    async sellerLogin(req, res) {
        try {
            const { email, password } = req.body;
            const userRepository = new PrismaUserRepository_1.PrismaUserRepository();
            const passwordService = new BcryptPasswordService_1.BcryptPasswordService();
            const tokenService = new JwtTokenService_1.JwtTokenService();
            const useCase = new LoginUseCase_1.LoginUseCase(userRepository, passwordService, tokenService);
            const result = await useCase.execute(email, password, {
                allowedRoles: ["SELLER"]
            });
            return res.status(200).json(result);
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(401).json({ message: error.message });
        }
    }
}
exports.AuthController = AuthController;
