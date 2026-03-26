import { OAuth2Client } from "google-auth-library";
import { ForbiddenError, UnauthorizedError } from "../../../shared/application/errors/AppError";
import { UserRepository } from "../domain/UserRepository";
import { ITokenService } from "../domain/services/ITokenService";
import { CompanyRepository } from "../../companies/domain/CompanyRepository";
import { sendEmailWithResend } from "../../../shared/infrastructure/email/ResendEmailService";

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
      throw new Error("GOOGLE_CLIENT_ID no está configurado");
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
      throw new UnauthorizedError("Token de Google inválido");
    }

    const email = String(payload?.email || "").trim().toLowerCase();
    const googleSub = String(payload?.sub || "").trim();
    const nombre = String(payload?.name || payload?.given_name || "").trim();
    const emailVerified = Boolean(payload?.email_verified);

    if (!email || !googleSub) {
      throw new UnauthorizedError("Token de Google inválido");
    }

    if (!emailVerified) {
      throw new UnauthorizedError("Tu cuenta de Google no tiene el correo verificado");
    }

    // 1) Preferimos buscar por sub (id estable), si no existe caemos por email.
    let user = await this.userRepository.findByGoogleSub(googleSub);
    if (!user) user = await this.userRepository.findByEmail(email);

    // Seguridad: store_admin debe existir (normalmente se provisiona junto a Company)
    if (!user) throw new ForbiddenError("No autorizado");

    // Seguridad: SOLO store_admin entra por Google.
    if (!user.roles.includes("STORE_ADMIN")) {
      throw new ForbiddenError("No autorizado");
    }

    // Google ya valida que el email esté verificado (payload.email_verified).
    // Marcamos también nuestro flag interno para que la UI/DB no confunda.
    if (!user.emailVerified) {
      await this.userRepository.markEmailVerified(user.id);
      user.emailVerified = true;
      console.info(`[store_admin_email_verified] marked verified userId=${user.id} email=${user.email}`);
    }

    // 2) Linkeamos la cuenta Google al usuario (si aplica)
    if (user.googleSub !== googleSub) {
      await this.userRepository.linkGoogleSub(user.id, googleSub);
      user.googleSub = googleSub;
    }

    // Si Google dice que el email está verificado, reflejamos eso en nuestro flag interno
    // (para evitar confusiones en la DB; no afecta el flujo de STORE_ADMIN).
    if (!user.emailVerified) {
      await this.userRepository.markEmailVerified(user.id);
      user.emailVerified = true;
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

    if (!user.storeAdminWelcomeEmailSentAt) {
      try {
        console.info(`[store_admin_welcome_email] sending to=${user.email} userId=${user.id}`);
        await sendEmailWithResend({
          toEmail: user.email,
          toName: user.nombre,
          subject: "Bienvenido/a",
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.5">
              <h2>Bienvenido/a, ${user.nombre}</h2>
              <p>Tu acceso como <strong>Admin de tienda</strong> quedó habilitado con Google.</p>
              <p>Si no fuiste tú, ignora este correo.</p>
            </div>
          `.trim()
        });
        await this.userRepository.markStoreAdminWelcomeEmailSent(user.id);
        console.info(`[store_admin_welcome_email] sent OK to=${user.email} userId=${user.id}`);
      } catch (err) {
        // No bloqueamos el login si falla el email.
        const message = err instanceof Error ? err.message : String(err);
        console.warn(`[store_admin_welcome_email] failed to send to=${user.email} userId=${user.id}: ${message}`);
      }
    } else {
      console.info(
        `[store_admin_welcome_email] skipped (already sent at=${user.storeAdminWelcomeEmailSentAt.toISOString()}) userId=${user.id}`
      );
    }

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
