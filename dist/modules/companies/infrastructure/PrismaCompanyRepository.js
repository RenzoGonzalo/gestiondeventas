"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaCompanyRepository = void 0;
const prisma_1 = __importDefault(require("../../../shared/infrastructure/persistence/prisma"));
const Company_1 = require("../domain/Company");
class PrismaCompanyRepository {
    async findById(id) {
        const companyData = await prisma_1.default.company.findUnique({
            where: { id }
        });
        if (!companyData)
            return null;
        return new Company_1.Company(companyData.id, companyData.name, companyData.ruc, companyData.address, companyData.createdAt, companyData.updatedAt);
    }
    async findByRuc(ruc) {
        const companyData = await prisma_1.default.company.findUnique({
            where: { ruc }
        });
        if (!companyData)
            return null;
        return new Company_1.Company(companyData.id, companyData.name, companyData.ruc, companyData.address, companyData.createdAt, companyData.updatedAt);
    }
    async create(data) {
        const companyData = await prisma_1.default.company.create({
            data: {
                name: data.name,
                ruc: data.ruc ?? null,
                address: data.address ?? null
            }
        });
        return new Company_1.Company(companyData.id, companyData.name, companyData.ruc, companyData.address, companyData.createdAt, companyData.updatedAt);
    }
}
exports.PrismaCompanyRepository = PrismaCompanyRepository;
