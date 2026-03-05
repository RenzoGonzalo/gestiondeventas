"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListProductsUseCase = void 0;
class ListProductsUseCase {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async execute(input) {
        const products = await this.productRepository.listByCompany(input);
        return products.map((p) => ({
            id: p.id,
            categoryId: p.categoryId,
            nombre: p.nombre,
            descripcion: p.descripcion,
            imagen: p.imagen,
            activo: p.activo,
            atributos: p.atributos,
            unitType: p.unitType
        }));
    }
}
exports.ListProductsUseCase = ListProductsUseCase;
