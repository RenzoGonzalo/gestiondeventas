import { UnitType } from "./UnitType";

export class Product {
  constructor(
    public readonly id: string,
    public readonly companyId: string,
    public categoryId: string,
    public nombre: string,
    public descripcion: string | null,
    public imagen: string | null,
    public activo: boolean,
    public atributos: unknown,
    public unitType: UnitType,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}
