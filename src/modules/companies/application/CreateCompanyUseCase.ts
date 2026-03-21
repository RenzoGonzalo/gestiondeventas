import { CompanyRepository } from "../domain/CompanyRepository";
import { ConflictError } from "../../../shared/application/errors/AppError";

function slugify(input: string) {
  const base = input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "");

  return base || "empresa";
}

async function generateUniqueSlug(name: string, companyRepository: CompanyRepository) {
  const base = slugify(name);

  let slug = base;
  let i = 2;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await companyRepository.findBySlug(slug);
    if (!existing) return slug;
    slug = `${base}-${i}`;
    i += 1;
  }
}

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
      slug: await generateUniqueSlug(input.name, this.companyRepository),
      ruc: input.ruc ?? null,
      address: input.address ?? null
    });

    return {
      id: company.id,
      name: company.name,
      slug: company.slug,
      ruc: company.ruc,
      address: company.address
    };
  }
}
