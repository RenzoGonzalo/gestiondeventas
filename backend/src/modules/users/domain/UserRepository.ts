import { User } from "./User";

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(data: {
    email: string;
    nombre: string;
    password: string;
    roleIds: string[];
    companyId?: string | null;
  }): Promise<User>;
}
