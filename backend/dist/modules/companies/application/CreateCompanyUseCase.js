"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCompanyUseCase = void 0;
const AppError_1 = require("../../../shared/application/errors/AppError");
class CreateCompanyUseCase {
    constructor(companyRepository) {
        this.companyRepository = companyRepository;
    }
    async execute(input) {
        const ruc = input.ruc ?? null;
        if (ruc) {
            const existing = await this.companyRepository.findByRuc(ruc);
            if (existing)
                throw new AppError_1.ConflictError("Company already exists");
        }
        const company = await this.companyRepository.create({
            name: input.name,
            ruc: input.ruc ?? null,
            address: input.address ?? null
        });
        return {
            id: company.id,
            name: company.name,
            ruc: company.ruc,
            address: company.address
        };
    }
}
exports.CreateCompanyUseCase = CreateCompanyUseCase;
