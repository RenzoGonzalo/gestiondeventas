import { Sale } from "./Sale";

export type CreateSaleItemInput = {
  variantId: string;
  quantity: string; // Decimal como string
  unitPrice?: string; // opcional: si no, se usa precioVenta de la variante
};

export interface SaleRepository {
  create(input: {
    companyId: string;
    sellerId: string;
    items: CreateSaleItemInput[];
  }): Promise<Sale>;

  findById(input: { companyId: string; id: string }): Promise<Sale | null>;

  listByCompany(input: {
    companyId: string;
    from?: Date;
    to?: Date;
  }): Promise<Sale[]>;

  cancel(input: {
    companyId: string;
    id: string;
    cancelledByUserId: string;
    reason?: string | null;
  }): Promise<Sale>;
}
