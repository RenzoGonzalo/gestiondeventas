import { CategoryRepository } from "../domain/CategoryRepository";

export class CreateCategoryUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute(input: {
    companyId: string;
    nombre: string;
    descripcion?: string | null;
  }) {
    const category = await this.categoryRepository.create({
      companyId: input.companyId,
      nombre: input.nombre,
      descripcion: input.descripcion ?? null
    });

    return {
      id: category.id,
      nombre: category.nombre,
      descripcion: category.descripcion,
      activo: category.activo
    };
  }
}
