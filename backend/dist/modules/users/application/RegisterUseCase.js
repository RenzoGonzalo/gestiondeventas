"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUseCase = void 0;
const AppError_1 = require("../../../shared/application/errors/AppError");
class RegisterUseCase {
    constructor(userRepository, roleRepository, passwordService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordService = passwordService;
    }
    async execute(input) {
        const { email, password, roleName } = input;
        const existing = await this.userRepository.findByEmail(email);
        if (existing) {
            throw new AppError_1.ConflictError("User already exists");
        }
        const hashed = await this.passwordService.hash(password);
        const role = await this.roleRepository.findByName(roleName);
        if (!role)
            throw new AppError_1.NotFoundError("Role not found");
        const user = await this.userRepository.create({
            email,
            password: hashed,
            roleId: role.id,
            companyId: input.companyId ?? null
        });
        return {
            id: user.id,
            email: user.email,
            roleId: user.roleId,
            companyId: user.companyId
        };
    }
}
exports.RegisterUseCase = RegisterUseCase;
