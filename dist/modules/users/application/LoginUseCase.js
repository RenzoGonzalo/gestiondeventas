"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUseCase = void 0;
const AppError_1 = require("../../../shared/application/errors/AppError");
function pickPrimaryRole(roles) {
    if (roles.includes("SUPER_ADMIN"))
        return "SUPER_ADMIN";
    if (roles.includes("STORE_ADMIN"))
        return "STORE_ADMIN";
    if (roles.includes("SELLER"))
        return "SELLER";
    return roles[0] ?? "";
}
class LoginUseCase {
    constructor(userRepository, passwordService, tokenService) {
        this.userRepository = userRepository;
        this.passwordService = passwordService;
        this.tokenService = tokenService;
    }
    async execute(email, password, options) {
        const user = await this.userRepository.findByEmail(email);
        if (!user)
            throw new AppError_1.UnauthorizedError("Credenciales inválidas");
        const allowedRoles = options?.allowedRoles ?? ["SUPER_ADMIN", "STORE_ADMIN"];
        const okRole = allowedRoles.some((r) => user.roles.includes(r));
        if (!okRole)
            throw new AppError_1.ForbiddenError("No autorizado para iniciar sesión");
        const valid = await this.passwordService.compare(password, user.password);
        if (!valid)
            throw new AppError_1.UnauthorizedError("Credenciales inválidas");
        const rol = pickPrimaryRole(user.roles);
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
                rol,
                roles: user.roles
            }
        };
    }
}
exports.LoginUseCase = LoginUseCase;
