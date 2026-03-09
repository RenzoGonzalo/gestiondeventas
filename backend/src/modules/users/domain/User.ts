export class User {
  constructor(
    public readonly id: string,
    public email: string,
    public nombre: string,
    public password: string,
    public companyId: string | null,
    public roles: string[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}
