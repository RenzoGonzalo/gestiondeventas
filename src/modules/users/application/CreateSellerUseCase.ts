import { ConflictError, ForbiddenError, NotFoundError } from "../../../shared/application/errors/AppError";
import { RoleRepository } from "../domain/RoleRepository";
import { UserRepository } from "../domain/UserRepository";
import { IPasswordService } from "../domain/services/IPasswordService";
import crypto from "crypto";

export class CreateSellerUseCase {
  constructor(
    private userRepository: UserRepository,
    private roleRepository: RoleRepository,
    private passwordService: IPasswordService
  ) {}

  async execute(input: {
    companyId: string | null;
    code: string;
    nombre: string;
  }) {
    if (!input.companyId) {
      throw new ForbiddenError("No autorizado: usuario sin companyId");
    }

    const code = String(input.code || "").trim();
    if (!/^[0-9]+$/.test(code) || !(code.length === 4 || code.length === 6)) {
      throw new ConflictError("Código inválido (debe ser 4 o 6 dígitos)");
    }

    const existingByCode = await this.userRepository.findBySellerCode(code);
    if (existingByCode) throw new ConflictError("Código ya existe");

    const role = await this.roleRepository.findByName("SELLER");
    if (!role) throw new NotFoundError("Role not found");

    // El vendedor se autentica por código, pero el schema requiere email/password.
    // Creamos valores internos (no usados por el vendedor).
    const internalEmail = `seller.${input.companyId}.${code}@local.test`;
    const internalPassword = crypto.randomBytes(24).toString("hex");
    const hashed = await this.passwordService.hash(internalPassword);

    const user = await this.userRepository.create({
      email: internalEmail,
      nombre: input.nombre,
      password: hashed,
      sellerCode: code,
      roleIds: [role.id],
      companyId: input.companyId
    });

    return {
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      companyId: user.companyId,
      code: user.sellerCode,
      rol: "SELLER",
      roles: user.roles
    };
  }
}
