import { UserRepository } from "../domain/UserRepository";
import { IPasswordService } from "../domain/services/IPasswordService";
import { ITokenService } from "../domain/services/ITokenService";
import { ForbiddenError, UnauthorizedError } from "../../../shared/application/errors/AppError";

export class LoginUseCase {
  constructor(
    private userRepository: UserRepository,
    private passwordService: IPasswordService,
    private tokenService: ITokenService
  ) {}

  async execute(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) throw new UnauthorizedError("Credenciales inválidas");

    if (user.roleName !== "SUPER_ADMIN" && user.roleName !== "STORE_ADMIN") {
      throw new ForbiddenError("No autorizado para iniciar sesión");
    }

    const valid = await this.passwordService.compare(
      password,
      user.password
    );

    if (!valid) throw new UnauthorizedError("Credenciales inválidas");

    const token = this.tokenService.generate({
      id: user.id,
      email: user.email,
      companyId: user.companyId,
      roleName: user.roleName
    });
    
    

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        companyId: user.companyId,
        roleName: user.roleName
      },
      redirectTo:
        user.roleName === "STORE_ADMIN" && user.companyId
          ? `/companies/${user.companyId}`
          : null
    };
  }
}