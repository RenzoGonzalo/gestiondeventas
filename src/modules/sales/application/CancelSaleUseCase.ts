import { SaleRepository } from "../domain/SaleRepository";

export class CancelSaleUseCase {
  constructor(private readonly saleRepository: SaleRepository) {}

  async execute(input: {
    companyId: string;
    id: string;
    cancelledByUserId: string;
    reason?: string | null;
  }) {
    const sale = await this.saleRepository.cancel(input);

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
