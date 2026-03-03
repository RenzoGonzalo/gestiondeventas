"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyController = void 0;
const PrismaCompanyRepository_1 = require("../infrastructure/PrismaCompanyRepository");
const GetCompanyByIdUseCase_1 = require("../application/GetCompanyByIdUseCase");
const AppError_1 = require("../../../shared/application/errors/AppError");
class CompanyController {
    async getById(req, res) {
        try {
            const companyId = String(req.params.companyId);
            const companyRepository = new PrismaCompanyRepository_1.PrismaCompanyRepository();
            const useCase = new GetCompanyByIdUseCase_1.GetCompanyByIdUseCase(companyRepository);
            const result = await useCase.execute(companyId);
            return res.status(200).json(result);
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(400).json({ message: error.message });
        }
    }
}
exports.CompanyController = CompanyController;
