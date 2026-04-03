import { ProductRepository } from "../domain/ProductRepository";

export class UpdateProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(input: {
    companyId: string;
    id: string;
    nombre?: string;
    descripcion?: string | null;
    imagen?: string | null;
    activo?: boolean;
    atributos?: unknown;
    unitType?: string;
    categoryId?: string;
  }) {
    const updated = await this.productRepository.update(input);

    return {
      id: updated.id,
      categoryId: updated.categoryId,
      nombre: updated.nombre,
      descripcion: updated.descripcion,
      imagen: updated.imagen,
      activo: updated.activo,
      atributos: updated.atributos,
      unitType: updated.unitType
    };
  }
}
