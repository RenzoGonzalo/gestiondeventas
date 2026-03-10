import { SaleRepository } from "../domain/SaleRepository";
import { SalesBadRequestError } from "../domain/SalesErrors";

export class CreateSaleUseCase {
  constructor(private readonly saleRepository: SaleRepository) {}

  async execute(input: {
    companyId: string;
    sellerId: string;
    items: Array<{ variantId: string; quantity: string; unitPrice?: string }>;
  }) {
    if (!input.items?.length) {
      throw new SalesBadRequestError("Sale items required");
    }

    const sale = await this.saleRepository.create({
      companyId: input.companyId,
      sellerId: input.sellerId,
      items: input.items
    });

    return {
      id: sale.id,
      receiptNumber: sale.receiptNumber,
      status: sale.status,
      total: sale.total,
      createdAt: sale.createdAt,
      items: sale.items.map((it) => ({
        id: it.id,
        variantId: it.variantId,
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        subtotal: it.subtotal
      }))
    };
  }
}
