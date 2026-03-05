"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCategoryUseCase = void 0;
class CreateCategoryUseCase {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    async execute(input) {
        const category = await this.categoryRepository.create({
            companyId: input.companyId,
            nombre: input.nombre,
            descripcion: input.descripcion ?? null
        });
        return {
            id: category.id,
            nombre: category.nombre,
            descripcion: category.descripcion,
            activo: category.activo
        };
    }
}
exports.CreateCategoryUseCase = CreateCategoryUseCase;
