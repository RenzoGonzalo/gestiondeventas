import { Company } from "./Company";

export interface CompanyRepository {
  create(data: { name: string; slug: string; ruc?: string | null; address?: string | null }): Promise<Company>;
  findByRuc(ruc: string): Promise<Company | null>;
  findBySlug(slug: string): Promise<Company | null>;
  findById(id: string): Promise<Company | null>;

  listAll(): Promise<Company[]>;
  update(input: {
    id: string;
    name?: string;
    ruc?: string | null;
    address?: string | null;
  }): Promise<Company>;
}
