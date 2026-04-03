type SendEmailParams = {
  toEmail: string;
  toName?: string;
  subject: string;
  html: string;
  text?: string;
};

export async function sendEmailWithBrevo(params: SendEmailParams): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME || 'Sistema';

  if (!apiKey) throw new Error('BREVO_API_KEY no configurado');
  if (!senderEmail) throw new Error('BREVO_SENDER_EMAIL no configurado');

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      sender: { email: senderEmail, name: senderName },
      to: [{ email: params.toEmail, name: params.toName }],
      subject: params.subject,
      htmlContent: params.html,
      textContent: params.text,
    }),
  });

  if (!res.ok) {
    const bodyText = await res.text().catch(() => '');

    // Helpful hint for the most common case during setup
    if (res.status === 403 && bodyText.includes('SMTP account is not yet activated')) {
      throw new Error(
        `Brevo send failed (403): tu cuenta aún no tiene habilitado el envío transaccional (SMTP relay/Transactional). ` +
          `En Brevo, activa Transactional/SMTP relay o solicita activación. Detalle: ${bodyText}`
      );
    }

    throw new Error(`Brevo send failed (${res.status}): ${bodyText}`);
  }
}
