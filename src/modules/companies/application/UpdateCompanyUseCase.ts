import { CompanyRepository } from "../domain/CompanyRepository";
import { NotFoundError } from "../../../shared/application/errors/AppError";

export class UpdateCompanyUseCase {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async execute(input: { id: string; name?: string; ruc?: string | null; address?: string | null }) {
    const existing = await this.companyRepository.findById(input.id);
    if (!existing) throw new NotFoundError("Company not found");

    const updated = await this.companyRepository.update({
      id: input.id,
      name: input.name,
      ruc: input.ruc,
      address: input.address
    });

    return {
      id: updated.id,
      name: updated.name,
      slug: updated.slug,
      ruc: updated.ruc,
      address: updated.address
    };
  }
}
