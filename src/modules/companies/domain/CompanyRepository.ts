import { Company } from "./Company";

export interface CompanyRepository {
  create(data: { name: string; ruc?: string | null; address?: string | null }): Promise<Company>;
  findByRuc(ruc: string): Promise<Company | null>;
  findById(id: string): Promise<Company | null>;
}
