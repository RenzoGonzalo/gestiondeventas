import { ProductRepository } from "../domain/ProductRepository";
import { InventoryConflictError, InventoryNotFoundError } from "../domain/InventoryErrors";

export class DeleteProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(input: { companyId: string; id: string }) {
    const existing = await this.productRepository.findById(input);
    if (!existing) throw new InventoryNotFoundError("Product not found");

    const moves = await this.productRepository.countStockMovementsByProduct({
      companyId: input.companyId,
      productId: input.id
    });

    if (moves > 0) {
      throw new InventoryConflictError(
        "No se puede eliminar: el producto tiene movimientos de stock"
      );
    }

    await this.productRepository.delete(input);
    return { ok: true };
  }
}
