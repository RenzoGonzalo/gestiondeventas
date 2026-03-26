import crypto from "crypto";
import { ForbiddenError } from "../../../shared/application/errors/AppError";
import { sendEmailWithGmailSmtp } from "../../../shared/infrastructure/email/GmailSmtpEmailService";
import { UserRepository } from "../domain/UserRepository";

export class ResendSuperAdminVerificationEmailUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(email: string) {
    const normalizedEmail = String(email || "").trim().toLowerCase();
    if (!normalizedEmail) {
      throw new ForbiddenError("No autorizado");
    }

    const user = await this.userRepository.findByEmail(normalizedEmail);
    if (!user) throw new ForbiddenError("No autorizado");

    if (!user.roles.includes("SUPER_ADMIN")) {
      throw new ForbiddenError("No autorizado");
    }

    if (user.emailVerified) {
      return { message: "El correo ya está verificado" };
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await this.userRepository.setEmailVerificationToken(user.id, tokenHash, expiresAt);

    const port = Number(process.env.PORT) || 4000;
    const backendUrl = (process.env.BACKEND_URL || `http://localhost:${port}`).trim().replace(/\/$/, "");
    const verifyUrl = `${backendUrl}/api/auth/verify-email?token=${encodeURIComponent(rawToken)}`;

    if (process.env.NODE_ENV !== "production") {
      console.log("🔗 Link de verificación (dev):", verifyUrl);
    }

    await sendEmailWithGmailSmtp({
      toEmail: normalizedEmail,
      toName: "Super Admin",
      subject: "Verifica tu correo (Sistema de Ventas)",
      html: `<h2>Verifica tu correo</h2><p>Haz clic para verificar tu cuenta:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p><p>Este enlace expira en 1 hora.</p>`,
      text: `Verifica tu correo: ${verifyUrl} (expira en 1 hora)`
    });

    return { message: "Correo de verificación reenviado" };
  }
}
