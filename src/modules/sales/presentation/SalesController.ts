import { Request, Response } from "express";
import { CreateSaleUseCase } from "../application/CreateSaleUseCase";
import { ListSalesUseCase } from "../application/ListSalesUseCase";
import { ListMySalesUseCase } from "../application/ListMySalesUseCase";
import { GetSaleByIdUseCase } from "../application/GetSaleByIdUseCase";
import { CancelSaleUseCase } from "../application/CancelSaleUseCase";
import { AppError } from "../../../shared/application/errors/AppError";
import { z } from "zod";
import { validateBody } from "../../../shared/infrastructure/validation/zod";

const createSaleBodySchema = z.object({
  items: z
    .array(
      z.object({
        variantId: z.string().min(1, "variantId requerido"),
        quantity: z.union([z.string(), z.number()]),
        unitPrice: z.union([z.string(), z.number()]).optional()
      })
    )
    .min(1, "items requerido")
});

export class SalesController {
  constructor(
    private readonly createSaleUseCase: CreateSaleUseCase,
    private readonly listSalesUseCase: ListSalesUseCase,
    private readonly listMySalesUseCase: ListMySalesUseCase,
    private readonly getSaleByIdUseCase: GetSaleByIdUseCase,
    private readonly cancelSaleUseCase: CancelSaleUseCase
  ) {}

  create = async (req: Request & { user?: any }, res: Response) => {
    try {
      const companyId = req.user?.companyId as string | null;
      const sellerId = req.user?.id as string | undefined;
      if (!companyId) return res.status(403).json({ message: "No autorizado: usuario sin companyId" });
      if (!sellerId) return res.status(401).json({ message: "Token missing" });

      const { items } = validateBody(createSaleBodySchema, req.body);

      const result = await this.createSaleUseCase.execute({
        companyId,
        sellerId,
        items: items.map((it: any) => ({
          variantId: String(it.variantId),
          quantity: String(it.quantity),
          unitPrice: it.unitPrice === undefined ? undefined : String(it.unitPrice)
        }))
      });

      return res.status(201).json(result);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Datos inválidos",
          details: error.issues.map((i) => ({ field: i.path.join("."), message: i.message }))
        });
      }

      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(400).json({ message: error.message });
    }
  };

  list = async (req: Request & { user?: any }, res: Response) => {
    try {
      const companyId = req.user?.companyId as string | null;
      if (!companyId) return res.status(403).json({ message: "No autorizado: usuario sin companyId" });

      const from = req.query.from ? new Date(String(req.query.from)) : undefined;
      const to = req.query.to ? new Date(String(req.query.to)) : undefined;

      const result = await this.listSalesUseCase.execute({ companyId, from, to });
      return res.status(200).json(result);
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(400).json({ message: error.message });
    }
  };

  listMine = async (req: Request & { user?: any }, res: Response) => {
    try {
      const companyId = req.user?.companyId as string | null;
      const sellerId = req.user?.id as string | undefined;
      if (!companyId) return res.status(403).json({ message: "No autorizado: usuario sin companyId" });
      if (!sellerId) return res.status(401).json({ message: "Token missing" });

      const from = req.query.from ? new Date(String(req.query.from)) : undefined;
      const to = req.query.to ? new Date(String(req.query.to)) : undefined;

      const result = await this.listMySalesUseCase.execute({ companyId, sellerId, from, to });
      return res.status(200).json(result);
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(400).json({ message: error.message });
    }
  };

  getById = async (req: Request & { user?: any }, res: Response) => {
    try {
      const companyId = req.user?.companyId as string | null;
      if (!companyId) return res.status(403).json({ message: "No autorizado: usuario sin companyId" });

      const id = String(req.params.id);
      const result = await this.getSaleByIdUseCase.execute({ companyId, id });

      return res.status(200).json(result);
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(400).json({ message: error.message });
    }
  };

  cancel = async (req: Request & { user?: any }, res: Response) => {
    try {
      const companyId = req.user?.companyId as string | null;
      const cancelledByUserId = req.user?.id as string | undefined;
      if (!companyId) return res.status(403).json({ message: "No autorizado: usuario sin companyId" });
      if (!cancelledByUserId) return res.status(401).json({ message: "Token missing" });

      const id = String(req.params.id);
      const reason = (req.body as any)?.reason ? String((req.body as any).reason) : null;

      const result = await this.cancelSaleUseCase.execute({
        companyId,
        id,
        cancelledByUserId,
        reason
      });

      return res.status(200).json(result);
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(400).json({ message: error.message });
    }
  };
}
