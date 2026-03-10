import { PrismaSaleRepository } from "./infrastructure/PrismaSaleRepository";

import { CreateSaleUseCase } from "./application/CreateSaleUseCase";
import { ListSalesUseCase } from "./application/ListSalesUseCase";
import { GetSaleByIdUseCase } from "./application/GetSaleByIdUseCase";
import { CancelSaleUseCase } from "./application/CancelSaleUseCase";

import { SalesController } from "./presentation/SalesController";

// --- Repositorios (Infra) ---
const saleRepository = new PrismaSaleRepository();

// --- Use cases (Application) ---
const createSaleUseCase = new CreateSaleUseCase(saleRepository);
const listSalesUseCase = new ListSalesUseCase(saleRepository);
const getSaleByIdUseCase = new GetSaleByIdUseCase(saleRepository);
const cancelSaleUseCase = new CancelSaleUseCase(saleRepository);

// --- Controllers (Presentation) ---
export const salesController = new SalesController(
  createSaleUseCase,
  listSalesUseCase,
  getSaleByIdUseCase,
  cancelSaleUseCase
);
