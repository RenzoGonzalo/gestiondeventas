import { SaleItem } from "./SaleItem";

export class Sale {
  constructor(
    public readonly id: string,
    public readonly companyId: string,
    public readonly sellerId: string,
    public total: string,
    public receiptNumber: string,
    public status: string,
    public items: SaleItem[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}
