import { SaleRepository } from "../domain/SaleRepository";
import { SalesNotFoundError } from "../domain/SalesErrors";

export class GetSaleByIdUseCase {
  constructor(private readonly saleRepository: SaleRepository) {}

  async execute(input: { companyId: string; id: string }) {
    const sale = await this.saleRepository.findById(input);
    if (!sale) throw new SalesNotFoundError("Sale not found");

    return {
      id: sale.id,
      receiptNumber: sale.receiptNumber,
      status: sale.status,
      total: sale.total,
      sellerId: sale.sellerId,
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
