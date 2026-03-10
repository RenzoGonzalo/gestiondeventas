import { Response } from "express";
import { AddVariantToProductUseCase } from "../application/AddVariantToProductUseCase";
import { UpdateVariantUseCase } from "../application/UpdateVariantUseCase";
import { DeleteVariantUseCase } from "../application/DeleteVariantUseCase";
import { AdjustVariantStockUseCase } from "../application/AdjustVariantStockUseCase";
import { AppError } from "../../../shared/application/errors/AppError";

export class VariantController {
  constructor(
    private readonly addVariantToProductUseCase: AddVariantToProductUseCase,
    private readonly updateVariantUseCase: UpdateVariantUseCase,
    private readonly deleteVariantUseCase: DeleteVariantUseCase,
    private readonly adjustVariantStockUseCase: AdjustVariantStockUseCase
  ) {}

  addToProduct = async (req: any, res: Response) => {
    try {
      const companyId = req.user?.companyId as string | null;
      const userId = req.user?.id as string | undefined;
      if (!companyId) return res.status(403).json({ message: "No autorizado: usuario sin companyId" });
      if (!userId) return res.status(401).json({ message: "Token missing" });

      const productId = String(req.params.id);
      const body = req.body;

      const result = await this.addVariantToProductUseCase.execute({
        companyId,
        productId,
        creadoPor: userId,
        nombre: body.nombre,
        sku: body.sku,
        codigoBarras: body.codigoBarras,
        atributos: body.atributos,
        unitType: body.unitType,
        precioCompra: body.precioCompra,
        precioVenta: body.precioVenta,
        stockActual: body.stockActual,
        stockMinimo: body.stockMinimo,
        ubicacion: body.ubicacion,
        activo: body.activo
      });

      return res.status(201).json(result);
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(400).json({ message: error.message });
    }
  };

  update = async (req: any, res: Response) => {
    try {
      const companyId = req.user?.companyId as string | null;
      if (!companyId) return res.status(403).json({ message: "No autorizado: usuario sin companyId" });

      const id = String(req.params.id);
      const body = req.body;

      const result = await this.updateVariantUseCase.execute({
        companyId,
        id,
        nombre: body.nombre,
        sku: body.sku,
        codigoBarras: body.codigoBarras,
        atributos: body.atributos,
        unitType: body.unitType,
        precioCompra: body.precioCompra,
        precioVenta: body.precioVenta,
        stockMinimo: body.stockMinimo,
        ubicacion: body.ubicacion,
        activo: body.activo
      });

      return res.status(200).json(result);
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(400).json({ message: error.message });
    }
  };

  delete = async (req: any, res: Response) => {
    try {
      const companyId = req.user?.companyId as string | null;
      if (!companyId) return res.status(403).json({ message: "No autorizado: usuario sin companyId" });

      const id = String(req.params.id);

      const result = await this.deleteVariantUseCase.execute({ companyId, id });
      return res.status(200).json(result);
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(400).json({ message: error.message });
    }
  };

  adjustStock = async (req: any, res: Response) => {
    try {
      const companyId = req.user?.companyId as string | null;
      const userId = req.user?.id as string | undefined;
      if (!companyId) return res.status(403).json({ message: "No autorizado: usuario sin companyId" });
      if (!userId) return res.status(401).json({ message: "Token missing" });

      const variantId = String(req.params.id);
      const { cantidad, motivo } = req.body;

      const result = await this.adjustVariantStockUseCase.execute({
        companyId,
        variantId,
        cantidad: String(cantidad),
        motivo,
        usuarioId: userId
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
