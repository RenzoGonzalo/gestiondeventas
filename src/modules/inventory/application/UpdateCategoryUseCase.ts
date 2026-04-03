import { CategoryRepository } from "../domain/CategoryRepository";

export class UpdateCategoryUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute(input: {
    companyId: string;
    id: string;
    nombre?: string;
    descripcion?: string | null;
    activo?: boolean;
  }) {
    const updated = await this.categoryRepository.update(input);
    return {
      id: updated.id,
      nombre: updated.nombre,
      descripcion: updated.descripcion,
      activo: updated.activo
    };
  }
}
