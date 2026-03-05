"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteVariantUseCase = void 0;
const InventoryErrors_1 = require("../domain/InventoryErrors");
class DeleteVariantUseCase {
    constructor(variantRepository) {
        this.variantRepository = variantRepository;
    }
    async execute(input) {
        const existing = await this.variantRepository.findById(input);
        if (!existing)
            throw new InventoryErrors_1.InventoryNotFoundError("Variant not found");
        const moves = await this.variantRepository.countStockMovements({
            companyId: input.companyId,
            variantId: input.id
        });
        if (moves > 0) {
            throw new InventoryErrors_1.InventoryConflictError("No se puede eliminar: la variante tiene movimientos de stock");
        }
        await this.variantRepository.delete(input);
        return { ok: true };
    }
}
exports.DeleteVariantUseCase = DeleteVariantUseCase;
