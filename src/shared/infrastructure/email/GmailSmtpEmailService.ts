import nodemailer from "nodemailer";

export type SendEmailParams = {
  toEmail: string;
  toName?: string;
  subject: string;
  html: string;
  text?: string;
};

export async function sendEmailWithGmailSmtp(params: SendEmailParams): Promise<void> {
  const user = String(process.env.EMAIL_USER || "").trim();
  const pass = String(process.env.EMAIL_PASS || "").trim();

  if (!user) throw new Error("EMAIL_USER no configurado");
  if (!pass) throw new Error("EMAIL_PASS no configurado");

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user,
      pass
    }
  });

  await transporter.sendMail({
    from: `Sistema de Ventas <${user}>`,
    to: params.toName ? `${params.toName} <${params.toEmail}>` : params.toEmail,
    subject: params.subject,
    html: params.html,
    text: params.text
  });
}
