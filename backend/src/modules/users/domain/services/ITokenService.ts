export interface ITokenService {
  generate(payload: {
    id: string;
    email: string;
    companyId: string | null;
    roleName: string;
  }): string;
}