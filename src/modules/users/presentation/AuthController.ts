import { Request, Response } from "express";
import { LoginUseCase } from "../application/LoginUseCase";
import { LoginWithGoogleUseCase } from "../application/LoginWithGoogleUseCase";
import { ResendSuperAdminVerificationEmailUseCase } from "../application/ResendSuperAdminVerificationEmailUseCase";
import { SellerCodeLoginUseCase } from "../application/SellerCodeLoginUseCase";
import { AppError } from "../../../shared/application/errors/AppError";
import crypto from "crypto";
import { UserRepository } from "../domain/UserRepository";
import { z } from "zod";
import { validateBody } from "../../../shared/infrastructure/validation/zod";

const sellerLoginBodySchema = z.object({
  nombre: z.string().trim().min(1, "Nombre requerido").max(120, "Nombre demasiado largo"),
  code: z
    .string()
    .trim()
    .regex(/^\d+$/, "El codigo debe ser numerico")
    .length(6, "El codigo debe ser de 6 digitos")
});

const loginBodySchema = z.object({
  email: z.string().email("Email invalido"),
  password: z.string().min(1, "Password requerido")
});

export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly loginWithGoogleUseCase: LoginWithGoogleUseCase,
    private readonly resendSuperAdminVerificationEmailUseCase: ResendSuperAdminVerificationEmailUseCase,
    private readonly sellerCodeLoginUseCase: SellerCodeLoginUseCase,
    private readonly userRepository: UserRepository
  ) {}

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = validateBody(loginBodySchema, req.body);

      const result = await this.loginUseCase.execute(email, password, {
        allowedRoles: ["SUPER_ADMIN"]
      });

      return res.status(200).json(result);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Datos invalidos",
          details: error.issues.map((i) => ({ field: i.path.join("."), message: i.message }))
        });
      }

      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(401).json({ message: error.message });
    }
  };

  sellerLogin = async (req: Request, res: Response) => {
    try {
      const { nombre, code } = validateBody(sellerLoginBodySchema, req.body);

      const result = await this.sellerCodeLoginUseCase.execute({
        nombre,
        code
      });

      return res.status(200).json(result);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Datos invalidos",
          details: error.issues.map((i) => ({ field: i.path.join("."), message: i.message }))
        });
      }

      if (error instanceof AppError) {
        return res.status(401).json({ message: "Credenciales invalidas" });
      }

      return res.status(401).json({ message: "Credenciales invalidas" });
    }
  };

  googleLogin = async (req: Request, res: Response) => {
    try {
      const idToken = String(req.body?.idToken ?? "").trim();
      if (!idToken) return res.status(400).json({ message: "idToken requerido" });

      const result = await this.loginWithGoogleUseCase.execute(idToken);
      return res.status(200).json(result);
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(401).json({ message: error.message });
    }
  };

  resendVerificationEmail = async (req: Request, res: Response) => {
    try {
      const email = String(req.body?.email ?? "").trim();
      const result = await this.resendSuperAdminVerificationEmailUseCase.execute(email);
      return res.status(200).json(result);
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(400).json({ message: error.message });
    }
  };

  verifyEmail = async (req: Request, res: Response) => {
    try {
      const token = String(req.query.token || "").trim();
      if (!token) return res.status(400).json({ message: "Token requerido" });

      const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
      const user = await this.userRepository.findByEmailVerificationTokenHash(tokenHash);

      if (!user) return res.status(400).json({ message: "Token invalido" });
      if (!user.emailVerificationTokenExpiresAt) {
        return res.status(400).json({ message: "Token invalido" });
      }
      if (user.emailVerificationTokenExpiresAt.getTime() < Date.now()) {
        return res.status(400).json({ message: "Token expirado" });
      }

      await this.userRepository.markEmailVerified(user.id);

      const frontendUrl = (process.env.FRONTEND_URL || "").trim().replace(/\/$/, "");
      if (frontendUrl) return res.redirect(`${frontendUrl}/login?verified=1`);

      return res.status(200).json({ message: "Email verificado" });
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: error.message });
    }
  };
}
