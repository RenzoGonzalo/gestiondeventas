import { ForbiddenError } from "../../../shared/application/errors/AppError";
import { UserRepository } from "../domain/UserRepository";

export class ListSellersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: { companyId: string | null }) {
    if (!input.companyId) {
      throw new ForbiddenError("No autorizado: usuario sin companyId");
    }

    const users = await this.userRepository.listSellersByCompany(input.companyId);

    return users.map((u) => ({
      id: u.id,
      email: u.email,
      nombre: u.nombre,
      companyId: u.companyId,
      // No exponer el código/PIN del vendedor en listados.
      code: null,
      rol: "SELLER" as const,
      roles: u.roles
    }));
  }
}
