export class StockMovement {
  constructor(
    public readonly id: string,
    public readonly companyId: string,
    public readonly variantId: string,
    public tipo: string,
    public cantidad: string,
    public stockAnterior: string,
    public stockNuevo: string,
    public motivo: string | null,
    public saleId: string | null,
    public usuarioId: string,
    public readonly createdAt: Date
  ) {}
}
