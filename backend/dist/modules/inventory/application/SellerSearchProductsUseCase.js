"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SellerSearchProductsUseCase = void 0;
class SellerSearchProductsUseCase {
    constructor(variantRepository) {
        this.variantRepository = variantRepository;
    }
    async execute(input) {
        return this.variantRepository.sellerSearch(input);
    }
}
exports.SellerSearchProductsUseCase = SellerSearchProductsUseCase;
