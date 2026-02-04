import { PrismaClient, Role } from '@prisma/client';
import { hashPassword } from './hash';

const prisma = new PrismaClient();

const normalizeBranchSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
};

const ensureUser = async (params: {
  username: string;
  email: string;
  role: Role;
  branchId: number;
  passwordHash: string;
}) => {
  const existing = await prisma.user.findUnique({
    where: { username: params.username },
  });

  if (existing) {
    return prisma.user.update({
      where: { id: existing.id },
      data: {
        role: params.role,
        branchId: params.branchId,
        email: params.email,
      },
    });
  }

  return prisma.user.create({
    data: {
      username: params.username,
      email: params.email,
      password: params.passwordHash,
      role: params.role,
      branchId: params.branchId,
    },
  });
};

export const seedBranchStaff = async () => {
  try {
    console.log('🌱 Seeding branch staff...');

    const branches = await prisma.branch.findMany();
    if (!branches.length) {
      console.log('⚠️ No branches found. Seed branches first.');
      return;
    }

    const passwordHash = await hashPassword('Staff123!');

    for (const branch of branches) {
      const slug = normalizeBranchSlug(branch.name);

      const manager = await ensureUser({
        username: `${slug}_manager`,
        email: `${slug}.manager@steakz.com`,
        role: 'BRANCH_MANAGER',
        branchId: branch.id,
        passwordHash,
      });

      await ensureUser({
        username: `${slug}_chef`,
        email: `${slug}.chef@steakz.com`,
        role: 'CHEF',
        branchId: branch.id,
        passwordHash,
      });

      await ensureUser({
        username: `${slug}_cashier`,
        email: `${slug}.cashier@steakz.com`,
        role: 'CASHIER',
        branchId: branch.id,
        passwordHash,
      });

      await prisma.branch.update({
        where: { id: branch.id },
        data: { managerId: manager.id },
      });
    }

    console.log('✅ Branch staff seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding branch staff:', error);
  }
};
