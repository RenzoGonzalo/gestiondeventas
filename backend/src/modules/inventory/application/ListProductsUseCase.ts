import { ProductRepository } from "../domain/ProductRepository";

export class ListProductsUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(input: { companyId: string; categoryId?: string }) {
    const products = await this.productRepository.listByCompany(input);
    return products.map((p) => ({
      id: p.id,
      categoryId: p.categoryId,
      nombre: p.nombre,
      descripcion: p.descripcion,
      imagen: p.imagen,
      activo: p.activo,
      atributos: p.atributos,
      unitType: p.unitType
    }));
  }
}
