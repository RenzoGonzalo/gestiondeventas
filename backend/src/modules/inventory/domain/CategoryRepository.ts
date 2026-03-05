import { Category } from "./Category";

export interface CategoryRepository {
  create(input: {
    companyId: string;
    nombre: string;
    descripcion?: string | null;
  }): Promise<Category>;

  listByCompany(companyId: string): Promise<Category[]>;

  findById(input: { companyId: string; id: string }): Promise<Category | null>;

  update(input: {
    companyId: string;
    id: string;
    nombre?: string;
    descripcion?: string | null;
    activo?: boolean;
  }): Promise<Category>;

  delete(input: { companyId: string; id: string }): Promise<void>;

  countProducts(input: { companyId: string; categoryId: string }): Promise<number>;
}
