"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCategoryByIdUseCase = void 0;
const InventoryErrors_1 = require("../domain/InventoryErrors");
class GetCategoryByIdUseCase {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    async execute(input) {
        const category = await this.categoryRepository.findById(input);
        if (!category)
            throw new InventoryErrors_1.InventoryNotFoundError("Category not found");
        return {
            id: category.id,
            nombre: category.nombre,
            descripcion: category.descripcion,
            activo: category.activo
        };
    }
}
exports.GetCategoryByIdUseCase = GetCategoryByIdUseCase;
