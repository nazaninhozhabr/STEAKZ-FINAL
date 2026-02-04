import { seedBranches } from '../src/utils/seedBranches';
import { seedRBAC } from '../src/utils/seedRBAC';
import { seedAdminUser } from '../src/utils/seedAdmin';
import { seedBranchStaff } from '../src/utils/seedBranchStaff';
import { seedMenu } from '../src/utils/seedMenu';
import { seedInventory } from '../src/utils/seedInventory';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Start seeding...');

  // Order is crucial: Branches and Roles must come first
  await seedBranches();
  await seedRBAC();
  await seedAdminUser();
  await seedBranchStaff();
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
