export interface ITokenService {
  generate(payload: {
    id: string;
    email: string;
    nombre: string;
    companyId: string | null;
    rol: string;
    roles: string[];
  }): string;
}