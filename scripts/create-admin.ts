import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';

  // Check if admin user already exists
  const existingUser = await prisma.adminUser.findUnique({
    where: { username },
  });

  if (existingUser) {
    console.log(`Admin user '${username}' already exists.`);
    return;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create admin user
  const adminUser = await prisma.adminUser.create({
    data: {
      username,
      password: hashedPassword,
      email,
      role: 'super_admin',
    },
  });

  console.log(`✅ Admin user created successfully!`);
  console.log(`Username: ${adminUser.username}`);
  console.log(`Email: ${adminUser.email}`);
  console.log(`Password: ${password}`);
  console.log(`\n⚠️  Please change the password after first login!`);
}

main()
  .catch((e) => {
    console.error('Error creating admin user:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

