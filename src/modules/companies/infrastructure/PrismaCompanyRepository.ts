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
      companyData.slug,
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
      companyData.slug,
      companyData.ruc,
      companyData.address,
      companyData.createdAt,
      companyData.updatedAt
    );
  }

  async findBySlug(slug: string): Promise<Company | null> {
    const companyData = await prisma.company.findUnique({
      where: { slug }
    });

    if (!companyData) return null;

    return new Company(
      companyData.id,
      companyData.name,
      companyData.slug,
      companyData.ruc,
      companyData.address,
      companyData.createdAt,
      companyData.updatedAt
    );
  }

  async create(data: { name: string; slug: string; ruc?: string | null; address?: string | null }): Promise<Company> {
    const companyData = await prisma.company.create({
      data: {
        name: data.name,
        slug: data.slug,
        ruc: data.ruc ?? null,
        address: data.address ?? null
      }
    });

    return new Company(
      companyData.id,
      companyData.name,
      companyData.slug,
      companyData.ruc,
      companyData.address,
      companyData.createdAt,
      companyData.updatedAt
    );
  }

  async listAll(): Promise<Company[]> {
    const rows = await prisma.company.findMany({
      orderBy: { createdAt: "desc" },
      take: 500
    });

    return rows.map(
      (companyData) =>
        new Company(
          companyData.id,
          companyData.name,
          companyData.slug,
          companyData.ruc,
          companyData.address,
          companyData.createdAt,
          companyData.updatedAt
        )
    );
  }

  async update(input: {
    id: string;
    name?: string;
    ruc?: string | null;
    address?: string | null;
  }): Promise<Company> {
    const companyData = await prisma.company.update({
      where: { id: input.id },
      data: {
        name: input.name ?? undefined,
        ruc: input.ruc === undefined ? undefined : input.ruc,
        address: input.address === undefined ? undefined : input.address
      }
    });

    return new Company(
      companyData.id,
      companyData.name,
      companyData.slug,
      companyData.ruc,
      companyData.address,
      companyData.createdAt,
      companyData.updatedAt
    );
  }
}
