import { User } from "./User";

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(data: {
    email: string;
    password: string;
    roleId: string;
    companyId?: string | null;
  }): Promise<User>;
}
