import jwt from "jsonwebtoken";
import { ITokenService } from "../../domain/services/ITokenService";

export class JwtTokenService implements ITokenService {
  generate(payload: { id: string; email: string; companyId: string | null; roleName: string }) {
    return jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "1h"
    });
  }
}