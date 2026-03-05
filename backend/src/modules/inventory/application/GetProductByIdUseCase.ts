import { ProductRepository } from "../domain/ProductRepository";
import { VariantRepository } from "../domain/VariantRepository";
import { InventoryNotFoundError } from "../domain/InventoryErrors";

export class GetProductByIdUseCase {
  constructor(
    private productRepository: ProductRepository,
    private variantRepository: VariantRepository
  ) {}

  async execute(input: { companyId: string; id: string }) {
    const product = await this.productRepository.findById(input);
    if (!product) throw new InventoryNotFoundError("Product not found");

    const variantes = await this.variantRepository.listByProduct({
      companyId: input.companyId,
      productId: input.id
    });

    return {
      id: product.id,
      categoryId: product.categoryId,
      nombre: product.nombre,
      descripcion: product.descripcion,
      imagen: product.imagen,
      activo: product.activo,
      atributos: product.atributos,
      unitType: product.unitType,
      variantes: variantes.map((v) => ({
        id: v.id,
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
      }))
    };
  }
}
