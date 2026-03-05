import { Variant } from "./Variant";

export interface VariantRepository {
  listByProduct(input: { companyId: string; productId: string }): Promise<Variant[]>;

  create(input: {
    companyId: string;
    productId: string;
    nombre: string;
    sku: string;
    codigoBarras?: string | null;
    atributos: unknown;
    unitType?: string;
    precioCompra: string;
    precioVenta: string;
    stockActual?: string;
    stockMinimo?: string;
    ubicacion?: string | null;
    activo?: boolean;
    creadoPor: string;
  }): Promise<Variant>;

  update(input: {
    companyId: string;
    id: string;
    nombre?: string;
    sku?: string;
    codigoBarras?: string | null;
    atributos?: unknown;
    unitType?: string;
    precioCompra?: string;
    precioVenta?: string;
    stockMinimo?: string;
    ubicacion?: string | null;
    activo?: boolean;
  }): Promise<Variant>;

  delete(input: { companyId: string; id: string }): Promise<void>;

  findById(input: { companyId: string; id: string }): Promise<Variant | null>;

  countStockMovements(input: { companyId: string; variantId: string }): Promise<number>;

  adjustStock(input: {
    companyId: string;
    variantId: string;
    cantidad: string;
    motivo?: string | null;
    usuarioId: string;
  }): Promise<{ variant: Variant; movementId: string }>;

  sellerList(input: { companyId: string }): Promise<Array<{ id: string; nombre: string; precioVenta: string; stockActual: string }>>;

  sellerSearch(input: { companyId: string; q: string }): Promise<Array<{ id: string; nombre: string; precioVenta: string; stockActual: string }>>;
}
