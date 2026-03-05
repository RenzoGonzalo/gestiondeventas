"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetProductByIdUseCase = void 0;
const InventoryErrors_1 = require("../domain/InventoryErrors");
class GetProductByIdUseCase {
    constructor(productRepository, variantRepository) {
        this.productRepository = productRepository;
        this.variantRepository = variantRepository;
    }
    async execute(input) {
        const product = await this.productRepository.findById(input);
        if (!product)
            throw new InventoryErrors_1.InventoryNotFoundError("Product not found");
        const variantes = await this.variantRepository.listByProduct({
            companyId: input.companyId,
            productId: input.id
        });
        return {
            id: product.id,
            categoryId: product.categoryId,
            nombre: product.nombre,
            descripcion: product.descripcion,
            imagen: product.imagen,
            activo: product.activo,
            atributos: product.atributos,
            unitType: product.unitType,
            variantes: variantes.map((v) => ({
                id: v.id,
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
            }))
        };
    }
}
exports.GetProductByIdUseCase = GetProductByIdUseCase;
