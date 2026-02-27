import { Request, Response } from "express";
import { LoginUseCase } from "../application/LoginUseCase";
import { PrismaUserRepository } from "../infrastructure/PrismaUserRepository";

// El Controlador se encarga de recibir pedidos HTTP y enviar respuestas
export class AuthController {
  // Inyectamos el Repositorio de Prisma para su uso dentro del caso de uso
  private static userRepository = new PrismaUserRepository();
  private static loginUseCase = new LoginUseCase(this.userRepository);

  // Método estático para manejar el login vía HTTP POST
  static async login(req: Request, res: Response): Promise<void> {
    try {
      // 1. Extraemos el correo y clave del cuerpo de la petición (JSON)
      const { email, password } = req.body;

      // Validamos que se envíen ambos campos
      if (!email || !password) {
        res.status(400).json({ error: "Email y contraseña son obligatorios" });
        return;
      }

      // 2. Ejecutamos el caso de uso
      const result = await AuthController.loginUseCase.execute(email, password);

      // 3. Si todo va bien, devolvemos un 200 con el usuario y token
      res.status(200).json(result);
    } catch (error: any) {
      // 4. Si el login falla por credenciales u otros motivos, enviamos un 401
      res.status(401).json({ error: error.message });
    }
  }
}
