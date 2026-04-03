import { CreateCompanyUseCase } from "../../modules/companies/application/CreateCompanyUseCase";
import { CompanyRepository } from "../../modules/companies/domain/CompanyRepository";
import { RegisterUseCase } from "../../modules/users/application/RegisterUseCase";
import { RoleRepository } from "../../modules/users/domain/RoleRepository";
import { UserRepository } from "../../modules/users/domain/UserRepository";
import { IPasswordService } from "../../modules/users/domain/services/IPasswordService";
import crypto from "crypto";

export class ProvisionCompanyAndStoreAdminUseCase {
  private createCompanyUseCase: CreateCompanyUseCase;
  private registerUseCase: RegisterUseCase;

  constructor(deps: {
    companyRepository: CompanyRepository;
    userRepository: UserRepository;
    roleRepository: RoleRepository;
    passwordService: IPasswordService;
  }) {
    this.createCompanyUseCase = new CreateCompanyUseCase(deps.companyRepository);
    this.registerUseCase = new RegisterUseCase(
      deps.userRepository,
      deps.roleRepository,
      deps.passwordService
    );
  }

  async execute(input: {
    company: { name: string; ruc?: string | null; address?: string | null };
    admin: { email: string; password?: string | null; nombre: string };
  }) {
    const company = await this.createCompanyUseCase.execute(input.company);

    // STORE_ADMIN se autentica con Google, pero el schema requiere password.
    // Generamos una contraseña aleatoria que no se usará.
    const password = String(input.admin.password || "").trim() || crypto.randomBytes(24).toString("hex");

    const adminUser = await this.registerUseCase.execute({
      email: input.admin.email,
      nombre: input.admin.nombre,
      password,
      roleName: "STORE_ADMIN",
      companyId: company.id
    });

    return {
      company,
      adminUser
    };
  }
}
