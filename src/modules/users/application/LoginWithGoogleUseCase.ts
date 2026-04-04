import { OAuth2Client } from "google-auth-library";
import { ForbiddenError, UnauthorizedError } from "../../../shared/application/errors/AppError";
import { UserRepository } from "../domain/UserRepository";
import { ITokenService } from "../domain/services/ITokenService";
import { CompanyRepository } from "../../companies/domain/CompanyRepository";

export class LoginWithGoogleUseCase {
  private readonly oauthClient: OAuth2Client;
  private readonly audience: string;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: ITokenService,
    private readonly companyRepository: CompanyRepository
  ) {
    const clientId = String(process.env.GOOGLE_CLIENT_ID || "").trim();
    if (!clientId) {
      throw new Error("GOOGLE_CLIENT_ID no esta configurado");
    }

    this.audience = clientId;
    this.oauthClient = new OAuth2Client(clientId);
  }

  async execute(idToken: string) {
    let payload: any;
    try {
      const ticket = await this.oauthClient.verifyIdToken({
        idToken,
        audience: this.audience
      });
      payload = ticket.getPayload();
    } catch {
      throw new UnauthorizedError("Token de Google invalido");
    }

    const email = String(payload?.email || "").trim().toLowerCase();
    const googleSub = String(payload?.sub || "").trim();
    const nombre = String(payload?.name || payload?.given_name || "").trim();
    const emailVerified = Boolean(payload?.email_verified);

    if (!email || !googleSub) {
      throw new UnauthorizedError("Token de Google invalido");
    }

    if (!emailVerified) {
      throw new UnauthorizedError("Tu cuenta de Google no tiene el correo verificado");
    }

    let user = await this.userRepository.findByGoogleSub(googleSub);
    if (!user) user = await this.userRepository.findByEmail(email);

    if (!user) throw new ForbiddenError("No autorizado");

    if (!user.roles.includes("STORE_ADMIN")) {
      throw new ForbiddenError("No autorizado");
    }

    if (!user.emailVerified) {
      await this.userRepository.markEmailVerified(user.id);
      user.emailVerified = true;
      console.info(`[store_admin_email_verified] marked verified userId=${user.id} email=${user.email}`);
    }

    if (user.googleSub !== googleSub) {
      await this.userRepository.linkGoogleSub(user.id, googleSub);
      user.googleSub = googleSub;
    }

    if (!user.nombre && nombre) {
      user.nombre = nombre;
    }

    const rol = "STORE_ADMIN";
    const company = user.companyId ? await this.companyRepository.findById(user.companyId) : null;

    const token = this.tokenService.generate({
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      companyId: user.companyId,
      rol,
      roles: user.roles
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        companyId: user.companyId,
        companySlug: company?.slug ?? null,
        companyName: company?.name ?? null,
        rol,
        roles: user.roles
      }
    };
  }
}
