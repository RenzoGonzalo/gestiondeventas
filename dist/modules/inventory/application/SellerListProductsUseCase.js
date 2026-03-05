"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SellerListProductsUseCase = void 0;
class SellerListProductsUseCase {
    constructor(variantRepository) {
        this.variantRepository = variantRepository;
    }
    async execute(input) {
        return this.variantRepository.sellerList(input);
    }
}
exports.SellerListProductsUseCase = SellerListProductsUseCase;
