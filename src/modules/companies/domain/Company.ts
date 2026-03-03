export class Company {
  constructor(
    public readonly id: string,
    public name: string,
    public ruc: string | null,
    public address: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}
