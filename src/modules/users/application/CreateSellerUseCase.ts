import { ConflictError, ForbiddenError, NotFoundError } from "../../../shared/application/errors/AppError";
import { RoleRepository } from "../domain/RoleRepository";
import { UserRepository } from "../domain/UserRepository";
import { IPasswordService } from "../domain/services/IPasswordService";

export class CreateSellerUseCase {
  constructor(
    private userRepository: UserRepository,
    private roleRepository: RoleRepository,
    private passwordService: IPasswordService
  ) {}

  async execute(input: {
    companyId: string | null;
    email: string;
    password: string;
    nombre: string;
  }) {
    if (!input.companyId) {
      throw new ForbiddenError("No autorizado: usuario sin companyId");
    }

    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) throw new ConflictError("User already exists");

    const role = await this.roleRepository.findByName("SELLER");
    if (!role) throw new NotFoundError("Role not found");

    const hashed = await this.passwordService.hash(input.password);

    const user = await this.userRepository.create({
      email: input.email,
      nombre: input.nombre,
      password: hashed,
      roleIds: [role.id],
      companyId: input.companyId
    });

    return {
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      companyId: user.companyId,
      rol: "SELLER",
      roles: user.roles
    };
  }
}
