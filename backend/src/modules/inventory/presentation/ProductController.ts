import { Response } from "express";
import { CreateProductUseCase } from "../application/CreateProductUseCase";
import { ListProductsUseCase } from "../application/ListProductsUseCase";
import { GetProductByIdUseCase } from "../application/GetProductByIdUseCase";
import { UpdateProductUseCase } from "../application/UpdateProductUseCase";
import { DeleteProductUseCase } from "../application/DeleteProductUseCase";
import { AppError } from "../../../shared/application/errors/AppError";

export class ProductController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly listProductsUseCase: ListProductsUseCase,
    private readonly getProductByIdUseCase: GetProductByIdUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase
  ) {}

  create = async (req: any, res: Response) => {
    try {
      const companyId = req.user?.companyId as string | null;
      const userId = req.user?.id as string | undefined;
      if (!companyId) return res.status(403).json({ message: "No autorizado: usuario sin companyId" });
      if (!userId) return res.status(401).json({ message: "Token missing" });

      const body = req.body;

      const result = await this.createProductUseCase.execute({
        companyId,
        creadoPor: userId,
        categoryId: body.categoryId,
        nombre: body.nombre,
        descripcion: body.descripcion,
        imagen: body.imagen,
        activo: body.activo,
        atributos: body.atributos,
        unitType: body.unitType,
        variantes: body.variantes ?? []
      });

      return res.status(201).json(result);
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(400).json({ message: error.message });
    }
  };

  list = async (req: any, res: Response) => {
    try {
      const companyId = req.user?.companyId as string | null;
      if (!companyId) return res.status(403).json({ message: "No autorizado: usuario sin companyId" });

      const categoryId = req.query.categoryId ? String(req.query.categoryId) : undefined;

      const result = await this.listProductsUseCase.execute({ companyId, categoryId });
      return res.status(200).json(result);
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(400).json({ message: error.message });
    }
  };

  getById = async (req: any, res: Response) => {
    try {
      const companyId = req.user?.companyId as string | null;
      if (!companyId) return res.status(403).json({ message: "No autorizado: usuario sin companyId" });

      const id = String(req.params.id);

      const result = await this.getProductByIdUseCase.execute({ companyId, id });
      return res.status(200).json(result);
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

      const result = await this.updateProductUseCase.execute({
        companyId,
        id,
        nombre: body.nombre,
        descripcion: body.descripcion,
        imagen: body.imagen,
        activo: body.activo,
        atributos: body.atributos,
        unitType: body.unitType,
        categoryId: body.categoryId
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

      const result = await this.deleteProductUseCase.execute({ companyId, id });
      return res.status(200).json(result);
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(400).json({ message: error.message });
    }
  };
}
