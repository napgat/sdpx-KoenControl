const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = "plengnapat23@gmail.com";
  
  const user = await prisma.user.upsert({
    where: { email_lookup: email },
    update: {
      platform_role: 'SYSTEM_ADMIN',
      can_create_classroom: true,
      status: 'ACTIVE'
    },
    create: {
      email_lookup: email,
      email_raw: email,
      display_name: 'Plengnapat',
      platform_role: 'SYSTEM_ADMIN',
      can_create_classroom: true,
      status: 'ACTIVE'
    }
  });
  
  console.log("Admin user created successfully:", user.email_raw);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
