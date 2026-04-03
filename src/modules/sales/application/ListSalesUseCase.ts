import { SaleRepository } from "../domain/SaleRepository";

export class ListSalesUseCase {
  constructor(private readonly saleRepository: SaleRepository) {}

  async execute(input: { companyId: string; from?: Date; to?: Date }) {
    const sales = await this.saleRepository.listByCompany(input);

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
