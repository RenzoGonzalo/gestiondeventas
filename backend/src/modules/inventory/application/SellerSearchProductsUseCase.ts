import { VariantRepository } from "../domain/VariantRepository";

export class SellerSearchProductsUseCase {
  constructor(private variantRepository: VariantRepository) {}

  async execute(input: { companyId: string; q: string }) {
    return this.variantRepository.sellerSearch(input);
  }
}
