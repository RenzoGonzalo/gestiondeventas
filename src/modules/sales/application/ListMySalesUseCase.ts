import { SaleRepository } from "../domain/SaleRepository";

export class ListMySalesUseCase {
  constructor(private readonly saleRepository: SaleRepository) {}

  async execute(input: { companyId: string; sellerId: string; from?: Date; to?: Date }) {
    const sales = await this.saleRepository.listBySeller(input);

    return sales.map((s) => ({
      id: s.id,
      receiptNumber: s.receiptNumber,
      status: s.status,
      total: s.total,
      sellerId: s.sellerId,
      createdAt: s.createdAt,
      itemCount: s.items.length
    }));
  }
}
