export class SaleItem {
  constructor(
    public readonly id: string,
    public readonly saleId: string,
    public readonly variantId: string,
    public quantity: string,
    public unitPrice: string,
    public subtotal: string,
    public readonly variantNombre?: string,
    public readonly productNombre?: string
  ) {}
}
