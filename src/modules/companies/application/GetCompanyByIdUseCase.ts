import { CompanyRepository } from "../domain/CompanyRepository";
import { NotFoundError } from "../../../shared/application/errors/AppError";

export class GetCompanyByIdUseCase {
  constructor(private companyRepository: CompanyRepository) {}

  async execute(companyId: string) {
    const company = await this.companyRepository.findById(companyId);

    if (!company) {
      throw new NotFoundError("Company not found");
    }

    return {
      id: company.id,
      name: company.name,
      slug: company.slug,
      ruc: company.ruc,
      address: company.address
    };
  }
}
