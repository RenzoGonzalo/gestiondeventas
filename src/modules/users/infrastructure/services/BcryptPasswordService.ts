import bcrypt from "bcrypt";
import { IPasswordService } from "../../domain/services/IPasswordService";

export class BcryptPasswordService implements IPasswordService {
  async hash(password: string) {
    return bcrypt.hash(password, 10);
  }

  async compare(plain: string, hashed: string) {
    return bcrypt.compare(plain, hashed);
  }
}