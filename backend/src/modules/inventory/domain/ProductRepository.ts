import { Product } from "./Product";

export interface ProductRepository {
  createWithVariants(input: {
    companyId: string;
    categoryId: string;
    nombre: string;
    descripcion?: string | null;
    imagen?: string | null;
    activo?: boolean;
    atributos?: unknown;
    unitType?: string;
    creadoPor: string;
    variantes: Array<{
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
    }>;
  }): Promise<{ product: Product; variantIds: string[] }>;

  listByCompany(input: { companyId: string; categoryId?: string }): Promise<Product[]>;

  findById(input: { companyId: string; id: string }): Promise<Product | null>;

  update(input: {
    companyId: string;
    id: string;
    nombre?: string;
    descripcion?: string | null;
    imagen?: string | null;
    activo?: boolean;
    atributos?: unknown;
    unitType?: string;
    categoryId?: string;
  }): Promise<Product>;

  delete(input: { companyId: string; id: string }): Promise<void>;

  countStockMovementsByProduct(input: { companyId: string; productId: string }): Promise<number>;
}
