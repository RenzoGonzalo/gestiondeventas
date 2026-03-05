"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProductUseCase = void 0;
class UpdateProductUseCase {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async execute(input) {
        const updated = await this.productRepository.update(input);
        return {
            id: updated.id,
            categoryId: updated.categoryId,
            nombre: updated.nombre,
            descripcion: updated.descripcion,
            imagen: updated.imagen,
            activo: updated.activo,
            atributos: updated.atributos,
            unitType: updated.unitType
        };
    }
}
exports.UpdateProductUseCase = UpdateProductUseCase;
