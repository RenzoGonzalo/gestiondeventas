import { CompanyRepository } from "../domain/CompanyRepository";

export class ListCompaniesUseCase {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async execute() {
    const companies = await this.companyRepository.listAll();

    return companies.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      ruc: c.ruc,
      address: c.address,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt
    }));
  }
}
