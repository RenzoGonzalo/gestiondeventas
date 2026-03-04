export interface ITokenService {
  generate(payload: {
    id: string;
    email: string;
    companyId: string | null;
    roles: string[];
  }): string;
}