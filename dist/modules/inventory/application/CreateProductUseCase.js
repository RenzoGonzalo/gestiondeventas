"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProductUseCase = void 0;
class CreateProductUseCase {
    constructor(productRepository, variantRepository) {
        this.productRepository = productRepository;
        this.variantRepository = variantRepository;
    }
    async execute(input) {
        const { product } = await this.productRepository.createWithVariants({
            companyId: input.companyId,
            creadoPor: input.creadoPor,
            categoryId: input.categoryId,
            nombre: input.nombre,
            descripcion: input.descripcion ?? null,
            imagen: input.imagen ?? null,
            activo: input.activo ?? true,
            atributos: input.atributos ?? [],
            unitType: input.unitType,
            variantes: input.variantes
        });
        const variantes = await this.variantRepository.listByProduct({
            companyId: input.companyId,
            productId: product.id
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
exports.CreateProductUseCase = CreateProductUseCase;
