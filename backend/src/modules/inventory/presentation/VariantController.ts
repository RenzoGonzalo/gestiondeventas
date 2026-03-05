import { Response } from "express";
import { PrismaVariantRepository } from "../infrastructure/PrismaVariantRepository";
import { AddVariantToProductUseCase } from "../application/AddVariantToProductUseCase";
import { UpdateVariantUseCase } from "../application/UpdateVariantUseCase";
import { DeleteVariantUseCase } from "../application/DeleteVariantUseCase";
import { AdjustVariantStockUseCase } from "../application/AdjustVariantStockUseCase";
import { AppError } from "../../../shared/application/errors/AppError";

export class VariantController {
  async addToProduct(req: any, res: Response) {
    try {
      const companyId = req.user?.companyId as string | null;
      const userId = req.user?.id as string | undefined;
      if (!companyId) return res.status(403).json({ message: "No autorizado: usuario sin companyId" });
      if (!userId) return res.status(401).json({ message: "Token missing" });

      const productId = String(req.params.id);
      const body = req.body;

      const repo = new PrismaVariantRepository();
      const useCase = new AddVariantToProductUseCase(repo);

      const result = await useCase.execute({
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
  }

  async update(req: any, res: Response) {
    try {
      const companyId = req.user?.companyId as string | null;
      if (!companyId) return res.status(403).json({ message: "No autorizado: usuario sin companyId" });

      const id = String(req.params.id);
      const body = req.body;

      const repo = new PrismaVariantRepository();
      const useCase = new UpdateVariantUseCase(repo);

      const result = await useCase.execute({
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
  }

  async delete(req: any, res: Response) {
    try {
      const companyId = req.user?.companyId as string | null;
      if (!companyId) return res.status(403).json({ message: "No autorizado: usuario sin companyId" });

      const id = String(req.params.id);

      const repo = new PrismaVariantRepository();
      const useCase = new DeleteVariantUseCase(repo);

      const result = await useCase.execute({ companyId, id });
      return res.status(200).json(result);
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(400).json({ message: error.message });
    }
  }

  async adjustStock(req: any, res: Response) {
    try {
      const companyId = req.user?.companyId as string | null;
      const userId = req.user?.id as string | undefined;
      if (!companyId) return res.status(403).json({ message: "No autorizado: usuario sin companyId" });
      if (!userId) return res.status(401).json({ message: "Token missing" });

      const variantId = String(req.params.id);
      const { cantidad, motivo } = req.body;

      const repo = new PrismaVariantRepository();
      const useCase = new AdjustVariantStockUseCase(repo);

      const result = await useCase.execute({
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
  }
}
