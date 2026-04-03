import { PrismaCategoryRepository } from "./infrastructure/PrismaCategoryRepository";
import { PrismaProductRepository } from "./infrastructure/PrismaProductRepository";
import { PrismaVariantRepository } from "./infrastructure/PrismaVariantRepository";

import { CreateCategoryUseCase } from "./application/CreateCategoryUseCase";
import { ListCategoriesUseCase } from "./application/ListCategoriesUseCase";
import { GetCategoryByIdUseCase } from "./application/GetCategoryByIdUseCase";
import { UpdateCategoryUseCase } from "./application/UpdateCategoryUseCase";
import { DeleteCategoryUseCase } from "./application/DeleteCategoryUseCase";

import { CreateProductUseCase } from "./application/CreateProductUseCase";
import { ListProductsUseCase } from "./application/ListProductsUseCase";
import { GetProductByIdUseCase } from "./application/GetProductByIdUseCase";
import { UpdateProductUseCase } from "./application/UpdateProductUseCase";
import { DeleteProductUseCase } from "./application/DeleteProductUseCase";

import { AddVariantToProductUseCase } from "./application/AddVariantToProductUseCase";
import { UpdateVariantUseCase } from "./application/UpdateVariantUseCase";
import { DeleteVariantUseCase } from "./application/DeleteVariantUseCase";
import { AdjustVariantStockUseCase } from "./application/AdjustVariantStockUseCase";

import { SellerListProductsUseCase } from "./application/SellerListProductsUseCase";
import { SellerSearchProductsUseCase } from "./application/SellerSearchProductsUseCase";

import { CategoryController } from "./presentation/CategoryController";
import { ProductController } from "./presentation/ProductController";
import { VariantController } from "./presentation/VariantController";
import { SellerController } from "./presentation/SellerController";

// --- Repositorios (Infra) ---
const categoryRepository = new PrismaCategoryRepository();
const productRepository = new PrismaProductRepository();
const variantRepository = new PrismaVariantRepository();

// --- Use cases (Application) ---
const createCategoryUseCase = new CreateCategoryUseCase(categoryRepository);
const listCategoriesUseCase = new ListCategoriesUseCase(categoryRepository);
const getCategoryByIdUseCase = new GetCategoryByIdUseCase(categoryRepository);
const updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepository);
const deleteCategoryUseCase = new DeleteCategoryUseCase(categoryRepository);

const createProductUseCase = new CreateProductUseCase(productRepository, variantRepository);
const listProductsUseCase = new ListProductsUseCase(productRepository);
const getProductByIdUseCase = new GetProductByIdUseCase(productRepository, variantRepository);
const updateProductUseCase = new UpdateProductUseCase(productRepository);
const deleteProductUseCase = new DeleteProductUseCase(productRepository);

const addVariantToProductUseCase = new AddVariantToProductUseCase(variantRepository);
const updateVariantUseCase = new UpdateVariantUseCase(variantRepository);
const deleteVariantUseCase = new DeleteVariantUseCase(variantRepository);
const adjustVariantStockUseCase = new AdjustVariantStockUseCase(variantRepository);

const sellerListProductsUseCase = new SellerListProductsUseCase(variantRepository);
const sellerSearchProductsUseCase = new SellerSearchProductsUseCase(variantRepository);

// --- Controllers (Presentation) ---
export const categoryController = new CategoryController(
  createCategoryUseCase,
  listCategoriesUseCase,
  getCategoryByIdUseCase,
  updateCategoryUseCase,
  deleteCategoryUseCase
);

export const productController = new ProductController(
  createProductUseCase,
  listProductsUseCase,
  getProductByIdUseCase,
  updateProductUseCase,
  deleteProductUseCase
);

export const variantController = new VariantController(
  addVariantToProductUseCase,
  updateVariantUseCase,
  deleteVariantUseCase,
  adjustVariantStockUseCase
);

export const sellerController = new SellerController(
  sellerListProductsUseCase,
  sellerSearchProductsUseCase
);
