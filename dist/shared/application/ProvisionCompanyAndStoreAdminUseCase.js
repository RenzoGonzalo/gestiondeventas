"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProvisionCompanyAndStoreAdminUseCase = void 0;
const CreateCompanyUseCase_1 = require("../../modules/companies/application/CreateCompanyUseCase");
const RegisterUseCase_1 = require("../../modules/users/application/RegisterUseCase");
class ProvisionCompanyAndStoreAdminUseCase {
    constructor(deps) {
        this.createCompanyUseCase = new CreateCompanyUseCase_1.CreateCompanyUseCase(deps.companyRepository);
        this.registerUseCase = new RegisterUseCase_1.RegisterUseCase(deps.userRepository, deps.roleRepository, deps.passwordService);
    }
    async execute(input) {
        const company = await this.createCompanyUseCase.execute(input.company);
        const adminUser = await this.registerUseCase.execute({
            email: input.admin.email,
            password: input.admin.password,
            roleName: "STORE_ADMIN",
            companyId: company.id
        });
        return {
            company,
            adminUser
        };
    }
}
exports.ProvisionCompanyAndStoreAdminUseCase = ProvisionCompanyAndStoreAdminUseCase;
