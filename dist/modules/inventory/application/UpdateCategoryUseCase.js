"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCategoryUseCase = void 0;
class UpdateCategoryUseCase {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    async execute(input) {
        const updated = await this.categoryRepository.update(input);
        return {
            id: updated.id,
            nombre: updated.nombre,
            descripcion: updated.descripcion,
            activo: updated.activo
        };
    }
}
exports.UpdateCategoryUseCase = UpdateCategoryUseCase;
