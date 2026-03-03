import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // 1. Crear los 3 Roles fundamentales
  const roles = ['SUPER_ADMIN', 'STORE_ADMIN', 'SELLER'];
  const roleObjects = [];

  for (const roleName of roles) {
    const role = await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName },
    });
    roleObjects.push(role);
    console.log(`Rol verificado: ${roleName}`);
  }

  // 2. Crear al SuperAdmin de la plataforma
  const superAdminRole = roleObjects.find(r => r.name === 'SUPER_ADMIN');
  const hashedAdminPassword = await bcrypt.hash('admin123456', 10);

  await prisma.user.upsert({
    where: { email: 'superadmin@plataforma.com' },
    update: {},
    create: {
      email: 'superadmin@plataforma.com',
      password: hashedAdminPassword,
      roleId: superAdminRole!.id,
      // No tiene companyId porque es el dueño global
    },
  });

  console.log('✅ SuperAdmin creado: superadmin@plataforma.com');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });