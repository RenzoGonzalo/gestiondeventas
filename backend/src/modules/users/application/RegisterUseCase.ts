import { UserRepository } from "../domain/UserRepository";
import { IPasswordService } from "../domain/services/IPasswordService";
import { RoleRepository } from "../domain/RoleRepository";
import { ConflictError, NotFoundError } from "../../../shared/application/errors/AppError";

export class RegisterUseCase {
  constructor(
    private userRepository: UserRepository,
    private roleRepository: RoleRepository,
    private passwordService: IPasswordService
  ) {}

  async execute(input: {
    email: string;
    nombre: string;
    password: string;
    roleName: string;
    companyId?: string | null;
  }) {
    const { email, nombre, password, roleName } = input;

    const existing = await this.userRepository.findByEmail(email);

    if (existing) {
      throw new ConflictError("User already exists");
    }

    const hashed = await this.passwordService.hash(password);

    const role = await this.roleRepository.findByName(roleName);
    if (!role) throw new NotFoundError("Role not found");

    const user = await this.userRepository.create({
      email,
      nombre,
      password: hashed,
      roleIds: [role.id],
      companyId: input.companyId ?? null
    });

    return {
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      companyId: user.companyId,
      roles: user.roles
    };
  }
}
