import { CategoryRepository } from "../domain/CategoryRepository";
import { InventoryNotFoundError } from "../domain/InventoryErrors";

export class GetCategoryByIdUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute(input: { companyId: string; id: string }) {
    const category = await this.categoryRepository.findById(input);
    if (!category) throw new InventoryNotFoundError("Category not found");

    return {
      id: category.id,
      nombre: category.nombre,
      descripcion: category.descripcion,
      activo: category.activo
    };
  }
}
