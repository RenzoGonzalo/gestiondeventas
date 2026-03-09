import { Request, Response } from "express";
import { LoginUseCase } from "../application/LoginUseCase";
import { AppError } from "../../../shared/application/errors/AppError";

export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const result = await this.loginUseCase.execute(email, password, {
        allowedRoles: ["SUPER_ADMIN", "STORE_ADMIN"]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
      });

      return res.status(200).json(result);
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(401).json({ message: error.message });
    }
  };

  sellerLogin = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const result = await this.loginUseCase.execute(email, password, {
        allowedRoles: ["SELLER"]
      });

      return res.status(200).json(result);
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(401).json({ message: error.message });
    }
  };
}
