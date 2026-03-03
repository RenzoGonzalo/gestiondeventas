import { CompanyRepository } from "../domain/CompanyRepository";
import { ConflictError } from "../../../shared/application/errors/AppError";

export class CreateCompanyUseCase {
  constructor(private companyRepository: CompanyRepository) {}

  async execute(input: { name: string; ruc?: string | null; address?: string | null }) {
    const ruc = input.ruc ?? null;

    if (ruc) {
      const existing = await this.companyRepository.findByRuc(ruc);
      if (existing) throw new ConflictError("Company already exists");
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
