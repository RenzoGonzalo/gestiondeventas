import { CategoryRepository } from "../domain/CategoryRepository";
import { InventoryConflictError, InventoryNotFoundError } from "../domain/InventoryErrors";

export class DeleteCategoryUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute(input: { companyId: string; id: string }) {
    const existing = await this.categoryRepository.findById(input);
    if (!existing) throw new InventoryNotFoundError("Category not found");

    const productsCount = await this.categoryRepository.countProducts({
      companyId: input.companyId,
      categoryId: input.id
    });

    if (productsCount > 0) {
      throw new InventoryConflictError("No se puede eliminar: la categoría tiene productos");
    }

    await this.categoryRepository.delete(input);
    return { ok: true };
  }
}
