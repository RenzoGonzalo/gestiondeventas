import prisma from "../../../shared/infrastructure/persistence/prisma";
import { CompanyRepository } from "../domain/CompanyRepository";
import { Company } from "../domain/Company";

export class PrismaCompanyRepository implements CompanyRepository {
  async findById(id: string): Promise<Company | null> {
    const companyData = await prisma.company.findUnique({
      where: { id }
    });

    if (!companyData) return null;

    return new Company(
      companyData.id,
      companyData.name,
      companyData.ruc,
      companyData.address,
      companyData.createdAt,
      companyData.updatedAt
    );
  }

  async findByRuc(ruc: string): Promise<Company | null> {
    const companyData = await prisma.company.findUnique({
      where: { ruc }
    });

    if (!companyData) return null;

    return new Company(
      companyData.id,
      companyData.name,
      companyData.ruc,
      companyData.address,
      companyData.createdAt,
      companyData.updatedAt
    );
  }

  async create(data: { name: string; ruc?: string | null; address?: string | null }): Promise<Company> {
    const companyData = await prisma.company.create({
      data: {
        name: data.name,
        ruc: data.ruc ?? null,
        address: data.address ?? null
      }
    });

    return new Company(
      companyData.id,
      companyData.name,
      companyData.ruc,
      companyData.address,
      companyData.createdAt,
      companyData.updatedAt
    );
  }
}
