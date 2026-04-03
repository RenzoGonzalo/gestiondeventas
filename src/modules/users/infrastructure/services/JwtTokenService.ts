import jwt from "jsonwebtoken";
import { ITokenService } from "../../domain/services/ITokenService";

export class JwtTokenService implements ITokenService {
  generate(payload: { id: string; email: string; nombre: string; companyId: string | null; rol: string; roles: string[] }) {
    return jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "1h"
    });
  }
}