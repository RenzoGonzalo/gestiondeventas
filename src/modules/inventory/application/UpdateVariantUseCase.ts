import { VariantRepository } from "../domain/VariantRepository";

export class UpdateVariantUseCase {
  constructor(private variantRepository: VariantRepository) {}

  async execute(input: {
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
  }) {
    const v = await this.variantRepository.update(input);

    return {
      id: v.id,
      productId: v.productId,
      nombre: v.nombre,
      sku: v.sku,
      codigoBarras: v.codigoBarras,
      atributos: v.atributos,
      unitType: v.unitType,
      precioCompra: v.precioCompra,
      precioVenta: v.precioVenta,
      stockActual: v.stockActual,
      stockMinimo: v.stockMinimo,
      ubicacion: v.ubicacion,
      activo: v.activo
    };
  }
}
