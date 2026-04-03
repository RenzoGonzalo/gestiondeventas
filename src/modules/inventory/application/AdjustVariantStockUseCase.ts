import { VariantRepository } from "../domain/VariantRepository";

export class AdjustVariantStockUseCase {
  constructor(private variantRepository: VariantRepository) {}

  async execute(input: {
    companyId: string;
    variantId: string;
    cantidad: string;
    motivo?: string | null;
    usuarioId: string;
  }) {
    const { variant, movementId } = await this.variantRepository.adjustStock({
      companyId: input.companyId,
      variantId: input.variantId,
      cantidad: input.cantidad,
      motivo: input.motivo ?? null,
      usuarioId: input.usuarioId
    });

    return {
      movementId,
      variant: {
        id: variant.id,
        productId: variant.productId,
        nombre: variant.nombre,
        sku: variant.sku,
        precioVenta: variant.precioVenta,
        stockActual: variant.stockActual,
        stockMinimo: variant.stockMinimo
      }
    };
  }
}
