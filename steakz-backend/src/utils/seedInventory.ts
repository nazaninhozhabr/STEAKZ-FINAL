import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedInventory() {
  // Find the first branch (e.g., London) to put these items into
  const branch = await prisma.branch.findFirst();
  
  if (!branch) {
    console.log('❌ No branch found. Please create a branch first (e.g., London) before seeding inventory.');
    return;
  }

  console.log(`📦 Seeding inventory for branch: ${branch.name}...`);

  const inventoryItems = [
    { name: 'Beef', quantity: 50, unit: 'kg', minThreshold: 10, branchId: branch.id },
    { name: 'Chicken', quantity: 30, unit: 'kg', minThreshold: 5, branchId: branch.id },
    { name: 'Lettuce', quantity: 20, unit: 'kg', minThreshold: 3, branchId: branch.id },
    { name: 'Potatoes', quantity: 40, unit: 'kg', minThreshold: 8, branchId: branch.id },
    { name: 'Onions', quantity: 15, unit: 'kg', minThreshold: 2, branchId: branch.id },
    { name: 'Garlic', quantity: 5, unit: 'kg', minThreshold: 1, branchId: branch.id },
    { name: 'Salt', quantity: 10, unit: 'kg', minThreshold: 2, branchId: branch.id },
    { name: 'Pepper', quantity: 3, unit: 'kg', minThreshold: 1, branchId: branch.id },
  ];

  // Loop through each item and add it to the database
  for (const item of inventoryItems) {
    await prisma.inventoryItem.upsert({
      // This tells Prisma: "Look for an item with this name in this specific branch"
      where: { 
        id: (await prisma.inventoryItem.findFirst({ 
          where: { name: item.name, branchId: item.branchId } 
        }))?.id || 0 
      },
      update: item, // If it exists, update the quantities
      create: item, // If it doesn't exist, create it
    });
  }

  console.log('✅ Inventory seeded successfully!');
}