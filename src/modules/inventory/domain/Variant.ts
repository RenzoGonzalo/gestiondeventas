import { UnitType } from "./UnitType";

export class Variant {
  constructor(
    public readonly id: string,
    public readonly companyId: string,
    public readonly productId: string,
    public nombre: string,
    public sku: string,
    public codigoBarras: string | null,
    public atributos: unknown,
    public unitType: UnitType,
    public precioCompra: string,
    public precioVenta: string,
    public stockActual: string,
    public stockMinimo: string,
    public ubicacion: string | null,
    public activo: boolean,
    public creadoPor: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}
