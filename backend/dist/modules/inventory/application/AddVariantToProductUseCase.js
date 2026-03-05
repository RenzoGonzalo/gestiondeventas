"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddVariantToProductUseCase = void 0;
class AddVariantToProductUseCase {
    constructor(variantRepository) {
        this.variantRepository = variantRepository;
    }
    async execute(input) {
        const v = await this.variantRepository.create(input);
        return {
            id: v.id,
            productId: v.productId,
            nombre: v.nombre,
            sku: v.sku,
            codigoBarras: v.codigoBarras,
            atributos: v.atributos,
            unitType: v.unitType,
            precioCompra: v.precioCompra,
            precioVenta: v.precioVenta,
            stockActual: v.stockActual,
            stockMinimo: v.stockMinimo,
            ubicacion: v.ubicacion,
            activo: v.activo
        };
    }
}
exports.AddVariantToProductUseCase = AddVariantToProductUseCase;
