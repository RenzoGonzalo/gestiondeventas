import { VariantRepository } from "../domain/VariantRepository";
import { InventoryConflictError, InventoryNotFoundError } from "../domain/InventoryErrors";

export class DeleteVariantUseCase {
  constructor(private variantRepository: VariantRepository) {}

  async execute(input: { companyId: string; id: string }) {
    const existing = await this.variantRepository.findById(input);
    if (!existing) throw new InventoryNotFoundError("Variant not found");

    const moves = await this.variantRepository.countStockMovements({
      companyId: input.companyId,
      variantId: input.id
    });

    if (moves > 0) {
      throw new InventoryConflictError(
        "No se puede eliminar: la variante tiene movimientos de stock"
      );
    }

    await this.variantRepository.delete(input);
    return { ok: true };
  }
}
