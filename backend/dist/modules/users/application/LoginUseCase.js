"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUseCase = void 0;
const AppError_1 = require("../../../shared/application/errors/AppError");
class LoginUseCase {
    constructor(userRepository, passwordService, tokenService) {
        this.userRepository = userRepository;
        this.passwordService = passwordService;
        this.tokenService = tokenService;
    }
    async execute(email, password) {
        const user = await this.userRepository.findByEmail(email);
        if (!user)
            throw new AppError_1.UnauthorizedError("Credenciales inválidas");
        if (user.roleName !== "SUPER_ADMIN" && user.roleName !== "STORE_ADMIN") {
            throw new AppError_1.ForbiddenError("No autorizado para iniciar sesión");
        }
        const valid = await this.passwordService.compare(password, user.password);
        if (!valid)
            throw new AppError_1.UnauthorizedError("Credenciales inválidas");
        const token = this.tokenService.generate({
            id: user.id,
            email: user.email,
            companyId: user.companyId,
            roleName: user.roleName
        });
        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                companyId: user.companyId,
                roleName: user.roleName
            },
            redirectTo: user.roleName === "STORE_ADMIN" && user.companyId
                ? `/companies/${user.companyId}`
                : null
        };
    }
}
exports.LoginUseCase = LoginUseCase;
