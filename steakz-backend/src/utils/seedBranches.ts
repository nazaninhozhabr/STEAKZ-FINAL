import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedBranches() {
  console.log('🌱 Seeding branches...');
  
  const branches = [
    { name: 'London', address: '123 Main St, London', phone: '020-7946-0958' },
    { name: 'Manchester', address: '456 King St, Manchester', phone: '0161-909-0186' },
    { name: 'Birmingham', address: '789 High St, Birmingham', phone: '0121-643-2514' },
  ];

  for (const branch of branches) {
    const existingBranch = await prisma.branch.findFirst({
      where: { name: branch.name },
    });

    if (existingBranch) {
      await prisma.branch.update({
        where: { id: existingBranch.id },
        data: { ...branch },
      });
    } else {
      await prisma.branch.create({
        data: { ...branch },
      });
    }
  }

  console.log('✅ Branches seeded successfully!');
}
