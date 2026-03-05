"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteCategoryUseCase = void 0;
const InventoryErrors_1 = require("../domain/InventoryErrors");
class DeleteCategoryUseCase {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    async execute(input) {
        const existing = await this.categoryRepository.findById(input);
        if (!existing)
            throw new InventoryErrors_1.InventoryNotFoundError("Category not found");
        const productsCount = await this.categoryRepository.countProducts({
            companyId: input.companyId,
            categoryId: input.id
        });
        if (productsCount > 0) {
            throw new InventoryErrors_1.InventoryConflictError("No se puede eliminar: la categoría tiene productos");
        }
        await this.categoryRepository.delete(input);
        return { ok: true };
    }
}
exports.DeleteCategoryUseCase = DeleteCategoryUseCase;
