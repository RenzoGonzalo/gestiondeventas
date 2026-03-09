"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSellerUseCase = void 0;
const AppError_1 = require("../../../shared/application/errors/AppError");
class CreateSellerUseCase {
    constructor(userRepository, roleRepository, passwordService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordService = passwordService;
    }
    async execute(input) {
        if (!input.companyId) {
            throw new AppError_1.ForbiddenError("No autorizado: usuario sin companyId");
        }
        const existing = await this.userRepository.findByEmail(input.email);
        if (existing)
            throw new AppError_1.ConflictError("User already exists");
        const role = await this.roleRepository.findByName("SELLER");
        if (!role)
            throw new AppError_1.NotFoundError("Role not found");
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
exports.CreateSellerUseCase = CreateSellerUseCase;
