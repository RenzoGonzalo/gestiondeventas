import { Request, Response } from "express";
import { PrismaUserRepository } from "../infrastructure/PrismaUserRepository";
import { BcryptPasswordService } from "../infrastructure/services/BcryptPasswordService";
import { JwtTokenService } from "../infrastructure/services/JwtTokenService";
import { LoginUseCase } from "../application/LoginUseCase";
import { AppError } from "../../../shared/application/errors/AppError";

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const userRepository = new PrismaUserRepository();
      const passwordService = new BcryptPasswordService();
      const tokenService = new JwtTokenService();

      const useCase = new LoginUseCase(
        userRepository,
        passwordService,
        tokenService
      );

      const result = await useCase.execute(email, password, {
        allowedRoles: ["SUPER_ADMIN", "STORE_ADMIN"]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
      });

      return res.status(200).json(result);
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(401).json({ message: error.message });
    }
  }

  async sellerLogin(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const userRepository = new PrismaUserRepository();
      const passwordService = new BcryptPasswordService();
      const tokenService = new JwtTokenService();

      const useCase = new LoginUseCase(
        userRepository,
        passwordService,
        tokenService
      );

      const result = await useCase.execute(email, password, {
        allowedRoles: ["SELLER"]
      });

      return res.status(200).json(result);
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(401).json({ message: error.message });
    }
  }
}
