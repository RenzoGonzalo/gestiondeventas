import { CategoryRepository } from "../domain/CategoryRepository";

export class ListCategoriesUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute(input: { companyId: string }) {
    const categories = await this.categoryRepository.listByCompany(input.companyId);
    return categories.map((c) => ({
      id: c.id,
      nombre: c.nombre,
      descripcion: c.descripcion,
      activo: c.activo
    }));
  }
}
