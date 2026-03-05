"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteProductUseCase = void 0;
const InventoryErrors_1 = require("../domain/InventoryErrors");
class DeleteProductUseCase {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async execute(input) {
        const existing = await this.productRepository.findById(input);
        if (!existing)
            throw new InventoryErrors_1.InventoryNotFoundError("Product not found");
        const moves = await this.productRepository.countStockMovementsByProduct({
            companyId: input.companyId,
            productId: input.id
        });
        if (moves > 0) {
            throw new InventoryErrors_1.InventoryConflictError("No se puede eliminar: el producto tiene movimientos de stock");
        }
        await this.productRepository.delete(input);
        return { ok: true };
    }
}
exports.DeleteProductUseCase = DeleteProductUseCase;
