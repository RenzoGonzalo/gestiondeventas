import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import crypto from 'crypto';
import { sendEmailWithResend } from '../src/shared/infrastructure/email/ResendEmailService';
import dotenv from 'dotenv';

// Asegura que el seed use el .env del proyecto (y no variables viejas del sistema)
dotenv.config({ override: true });

const prisma = new PrismaClient();

// Cambia estos valores si quieres fijarlos desde el código (seed)
const SEED_SUPER_ADMIN_EMAIL = 'renzo.quispe.va@tecsup.edu.pe';
const SEED_SUPER_ADMIN_PASSWORD = 'admin123456';

async function main() {
  // 1) Roles base
  const roles = ['SUPER_ADMIN', 'STORE_ADMIN', 'SELLER'] as const;
  const roleObjects = [] as { id: string; name: string }[];

  for (const roleName of roles) {
    const role = await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName },
    });
    roleObjects.push(role);
    console.log(`Rol verificado: ${roleName}`);
  }

  const superAdminRole = roleObjects.find((r) => r.name === 'SUPER_ADMIN');
  if (!superAdminRole) throw new Error('Role SUPER_ADMIN no encontrado');

  // 2) SUPER_ADMIN (email/password)
  const superAdminEmail = (process.env.SUPER_ADMIN_EMAIL || SEED_SUPER_ADMIN_EMAIL).trim().toLowerCase();
  const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD || SEED_SUPER_ADMIN_PASSWORD;
  const hashedAdminPassword = await bcrypt.hash(superAdminPassword, 10);

  const superAdminUser = await prisma.user.upsert({
    where: { email: superAdminEmail },
    update: {
      email: superAdminEmail,
      nombre: 'Super Admin',
      password: hashedAdminPassword,
      // No reseteamos emailVerified si ya fue verificado.
    },
    create: {
      email: superAdminEmail,
      nombre: 'Super Admin',
      password: hashedAdminPassword,
      emailVerified: false,
      emailVerificationTokenHash: null,
      emailVerificationTokenExpiresAt: null,
      // No tiene companyId porque es dueño global
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: { userId: superAdminUser.id, roleId: superAdminRole.id },
    },
    update: {},
    create: { userId: superAdminUser.id, roleId: superAdminRole.id },
  });

  // 3) Verificación por correo (si aún no está verificado)
  // En desarrollo puedes forzar re-verificación para probar el flujo.
  const forceReverify = process.env.FORCE_SUPER_ADMIN_REVERIFY === 'true';

  if (forceReverify && superAdminUser.emailVerified) {
    await prisma.user.update({
      where: { id: superAdminUser.id },
      data: {
        emailVerified: false,
        emailVerificationTokenHash: null,
        emailVerificationTokenExpiresAt: null,
      },
    });
    console.log('🟡 FORCE_SUPER_ADMIN_REVERIFY=true: email_verified reseteado a false.');
  }

  const freshUser = await prisma.user.findUnique({ where: { id: superAdminUser.id } });
  const isVerified = Boolean(freshUser?.emailVerified);

  if (!isVerified) {
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    await prisma.user.update({
      where: { id: superAdminUser.id },
      data: {
        emailVerificationTokenHash: tokenHash,
        emailVerificationTokenExpiresAt: expiresAt,
      },
    });

    const port = Number(process.env.PORT) || 4000;
    const backendUrl = (process.env.BACKEND_URL || `http://localhost:${port}`).trim().replace(/\/$/, '');
    const verifyUrl = `${backendUrl}/api/auth/verify-email?token=${encodeURIComponent(rawToken)}`;

    if (process.env.NODE_ENV !== 'production') {
      console.log('🔗 Link de verificación (dev):', verifyUrl);
    }

    try {
      await sendEmailWithResend({
        toEmail: superAdminEmail,
        toName: 'Super Admin',
        subject: 'Verifica tu correo (Sistema de Ventas)',
        html: `<h2>Verifica tu correo</h2><p>Haz clic para verificar tu cuenta:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p><p>Este enlace expira en 1 hora.</p>`,
        text: `Verifica tu correo: ${verifyUrl} (expira en 1 hora)`,
      });
      console.log('📨 Correo de verificación enviado (Resend).');
    } catch (e: any) {
      console.log('⚠️ No se pudo enviar el correo de verificación:', e?.message ?? e);
      console.log('   Puedes verificar manualmente abriendo este link:', verifyUrl);
    }
  } else {
    console.log('✅ SuperAdmin ya tiene email verificado; no se genera nuevo token.');
  }

  console.log(`✅ SuperAdmin listo: ${superAdminEmail}`);
  console.log('   - Requiere verificación de correo antes de login por password');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });