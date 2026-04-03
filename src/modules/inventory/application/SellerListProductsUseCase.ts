import { VariantRepository } from "../domain/VariantRepository";

export class SellerListProductsUseCase {
  constructor(private variantRepository: VariantRepository) {}

  async execute(input: { companyId: string }) {
    return this.variantRepository.sellerList(input);
  }
}
