import { UserRepository } from "../domain/UserRepository";
import { IPasswordService } from "../domain/services/IPasswordService";
import { ITokenService } from "../domain/services/ITokenService";
import { ForbiddenError, UnauthorizedError } from "../../../shared/application/errors/AppError";

function pickPrimaryRole(roles: string[]) {
  if (roles.includes("SUPER_ADMIN")) return "SUPER_ADMIN";
  if (roles.includes("STORE_ADMIN")) return "STORE_ADMIN";
  if (roles.includes("SELLER")) return "SELLER";
  return roles[0] ?? "";
}

export class LoginUseCase {
  constructor(
    private userRepository: UserRepository,
    private passwordService: IPasswordService,
    private tokenService: ITokenService
  ) {}

  async execute(
    email: string,
    password: string,
    options?: {
      allowedRoles?: string[];
    }
  ) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) throw new UnauthorizedError("Credenciales inválidas");

    const allowedRoles = options?.allowedRoles ?? ["SUPER_ADMIN", "STORE_ADMIN"];
    const okRole = allowedRoles.some((r) => user.roles.includes(r));
    if (!okRole) throw new ForbiddenError("No autorizado para iniciar sesión");

    const valid = await this.passwordService.compare(
      password,
      user.password
    );

    if (!valid) throw new UnauthorizedError("Credenciales inválidas");

    const rol = pickPrimaryRole(user.roles);

    const token = this.tokenService.generate({
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      companyId: user.companyId,
      rol,
      roles: user.roles
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        companyId: user.companyId,
        rol,
        roles: user.roles
      }
    };
  }
}