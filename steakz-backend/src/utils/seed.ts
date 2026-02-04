import { PrismaClient } from '@prisma/client';
import { seedBranches } from './seedBranches';
import { seedRBAC } from './seedRBAC';
import { seedAdminUser } from './seedAdmin';
import { seedMenu } from './seedMenu';
import { seedInventory } from './seedInventory';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Start seeding...');

  // Order is crucial: Branches and Roles must come first
  await seedBranches();
  await seedRBAC();
  await seedAdminUser();
  await seedMenu();
  await seedInventory();

  console.log('✅ Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });