"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdjustVariantStockUseCase = void 0;
class AdjustVariantStockUseCase {
    constructor(variantRepository) {
        this.variantRepository = variantRepository;
    }
    async execute(input) {
        const { variant, movementId } = await this.variantRepository.adjustStock({
            companyId: input.companyId,
            variantId: input.variantId,
            cantidad: input.cantidad,
            motivo: input.motivo ?? null,
            usuarioId: input.usuarioId
        });
        return {
            movementId,
            variant: {
                id: variant.id,
                productId: variant.productId,
                nombre: variant.nombre,
                sku: variant.sku,
                precioVenta: variant.precioVenta,
                stockActual: variant.stockActual,
                stockMinimo: variant.stockMinimo
            }
        };
    }
}
exports.AdjustVariantStockUseCase = AdjustVariantStockUseCase;
