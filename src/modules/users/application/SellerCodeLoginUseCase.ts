import { ForbiddenError, UnauthorizedError } from "../../../shared/application/errors/AppError";
import { UserRepository } from "../domain/UserRepository";
import { ITokenService } from "../domain/services/ITokenService";
import { CompanyRepository } from "../../companies/domain/CompanyRepository";

function normalizeName(value: string) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

export class SellerCodeLoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: ITokenService,
    private readonly companyRepository: CompanyRepository
  ) {}

  async execute(input: { nombre: string; code: string }) {
    const code = String(input.code || "").trim();
    const nombre = String(input.nombre || "").trim();

    if (!/^[0-9]+$/.test(code) || !(code.length === 4 || code.length === 6)) {
      throw new UnauthorizedError("Código inválido");
    }

    const user = await this.userRepository.findBySellerCode(code);
    if (!user) throw new UnauthorizedError("Código inválido");

    if (!user.roles.includes("SELLER")) {
      throw new ForbiddenError("No autorizado");
    }

    if (!user.companyId) {
      throw new ForbiddenError("No autorizado: vendedor sin companyId");
    }

    if (nombre && normalizeName(user.nombre) !== normalizeName(nombre)) {
      throw new UnauthorizedError("Nombre o código inválido");
    }

    const rol = "SELLER";
    const company = await this.companyRepository.findById(user.companyId);

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
        companySlug: company?.slug ?? null,
        companyName: company?.name ?? null,
        rol,
        roles: user.roles
      }
    };
  }
}
