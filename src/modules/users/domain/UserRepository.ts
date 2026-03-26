import { User } from "./User";

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  findByGoogleSub(googleSub: string): Promise<User | null>;
  findBySellerCode(code: string): Promise<User | null>;
  findByEmailVerificationTokenHash(tokenHash: string): Promise<User | null>;
  setEmailVerificationToken(userId: string, tokenHash: string, expiresAt: Date): Promise<void>;
  markEmailVerified(userId: string): Promise<void>;
  linkGoogleSub(userId: string, googleSub: string): Promise<void>;
  markStoreAdminWelcomeEmailSent(userId: string): Promise<void>;
  create(data: {
    email: string;
    nombre: string;
    password: string;
    sellerCode?: string | null;
    roleIds: string[];
    companyId?: string | null;
  }): Promise<User>;
}
