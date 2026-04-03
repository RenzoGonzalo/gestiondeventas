export class User {
  constructor(
    public readonly id: string,
    public email: string,
    public nombre: string,
    public password: string,
    public googleSub: string | null,
    public sellerCode: string | null,
    public storeAdminWelcomeEmailSentAt: Date | null,
    public emailVerified: boolean,
    public emailVerificationTokenHash: string | null,
    public emailVerificationTokenExpiresAt: Date | null,
    public companyId: string | null,
    public roles: string[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}
