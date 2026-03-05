"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListCategoriesUseCase = void 0;
class ListCategoriesUseCase {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    async execute(input) {
        const categories = await this.categoryRepository.listByCompany(input.companyId);
        return categories.map((c) => ({
            id: c.id,
            nombre: c.nombre,
            descripcion: c.descripcion,
            activo: c.activo
        }));
    }
}
exports.ListCategoriesUseCase = ListCategoriesUseCase;
