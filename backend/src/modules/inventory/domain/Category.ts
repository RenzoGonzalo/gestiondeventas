export class Category {
  constructor(
    public readonly id: string,
    public readonly companyId: string,
    public nombre: string,
    public descripcion: string | null,
    public activo: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}
