export class User {
  constructor(
    public readonly id: string,
    public email: string,
    public password: string,
    public roleId: string,
    public roleName: string,
    public companyId: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}
