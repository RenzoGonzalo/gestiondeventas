"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCompanyByIdUseCase = void 0;
const AppError_1 = require("../../../shared/application/errors/AppError");
class GetCompanyByIdUseCase {
    constructor(companyRepository) {
        this.companyRepository = companyRepository;
    }
    async execute(companyId) {
        const company = await this.companyRepository.findById(companyId);
        if (!company) {
            throw new AppError_1.NotFoundError("Company not found");
        }
        return {
            id: company.id,
            name: company.name,
            ruc: company.ruc,
            address: company.address
        };
    }
}
exports.GetCompanyByIdUseCase = GetCompanyByIdUseCase;
