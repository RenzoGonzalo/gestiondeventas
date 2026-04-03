import { Request, Response } from "express";
import { CreateSellerUseCase } from "../application/CreateSellerUseCase";
import { ListSellersUseCase } from "../application/ListSellersUseCase";
import { AppError } from "../../../shared/application/errors/AppError";
import { z } from "zod";
import { validateBody } from "../../../shared/infrastructure/validation/zod";

const createSellerBodySchema = z.object({
  nombre: z.string().min(1, "nombre requerido"),
  code: z
    .string()
    .regex(/^\d+$/, "El codigo debe ser numerico")
    .length(6, "El codigo debe ser de 6 digitos")
});

export class SellersController {
  constructor(
    private readonly createSellerUseCase: CreateSellerUseCase,
    private readonly listSellersUseCase: ListSellersUseCase
  ) {}

  list = async (req: Request & { user?: any }, res: Response) => {
    try {
      const companyId = req.user?.companyId as string | null;
      const result = await this.listSellersUseCase.execute({ companyId });
      return res.status(200).json(result);
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(400).json({ message: error.message });
    }
  };

  create = async (req: Request & { user?: any }, res: Response) => {
    try {
      const companyId = req.user?.companyId as string | null;
      if (!companyId) return res.status(403).json({ message: "No autorizado: usuario sin companyId" });

      const { code, nombre } = validateBody(createSellerBodySchema, req.body);
      const result = await this.createSellerUseCase.execute({
        companyId,
        code,
        nombre
      });

      return res.status(201).json(result);
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

      return res.status(400).json({ message: error.message });
    }
  };
}
