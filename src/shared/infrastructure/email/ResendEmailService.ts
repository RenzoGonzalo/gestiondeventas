type SendEmailParams = {
  toEmail: string;
  toName?: string;
  subject: string;
  html: string;
  text?: string;
};

export async function sendEmailWithResend(params: SendEmailParams): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const senderEmail = process.env.RESEND_SENDER_EMAIL;
  const senderName = process.env.RESEND_SENDER_NAME || 'Sistema';

  if (!apiKey) throw new Error('RESEND_API_KEY no configurado');
  if (!senderEmail) throw new Error('RESEND_SENDER_EMAIL no configurado');

  const from = `${senderName} <${senderEmail}>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [params.toEmail],
      subject: params.subject,
      html: params.html,
      text: params.text,
    }),
  });

  if (!res.ok) {
    const bodyText = await res.text().catch(() => '');

    // Helpful hint: Resend will reject unverified/unauthorized From domains
    if (res.status === 403 || res.status === 422) {
      throw new Error(
        `Resend send failed (${res.status}): revisa que el From (${from}) esté verificado/permitido en Resend. Detalle: ${bodyText}`
      );
    }

    if (res.status === 401) {
      throw new Error(`Resend send failed (401): API key inválida o sin permisos. Detalle: ${bodyText}`);
    }

    throw new Error(`Resend send failed (${res.status}): ${bodyText}`);
  }
}
