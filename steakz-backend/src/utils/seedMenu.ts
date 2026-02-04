import prisma from '../utils/prisma';

export async function seedMenu() {
  const branches = await prisma.branch.findMany();
  if (!branches.length) throw new Error('No branches found. Please seed branches first.');

  const menuItems = [
    { 
      name: 'Heritage Tomato Bruschetta', 
      description: 'Grilled sourdough with Isle of Wight tomatoes, garlic, and basil.', 
      price: 9, 
      category: 'starter', 
      isAvailable: true, 
      image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=800&q=80' 
    },
    { 
      name: 'Stilton & Pear Salad', 
      description: 'English Blue Stilton, Conference pears, and candied walnuts.', 
      price: 11, 
      category: 'salad', 
      isAvailable: true, 
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80' 
    },
    { 
      name: '28-Day Dry-Aged Ribeye', 
      description: 'Grass-fed British beef, served with roasted bone marrow.', 
      price: 34, 
      category: 'main', 
      isAvailable: true, 
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80' 
    },
    { 
      name: 'Pan-Seared Scottish Salmon', 
      description: 'Loch Duart salmon with minted crushed peas and lemon.', 
      price: 24, 
      category: 'main', 
      isAvailable: true, 
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80' 
    },
    { 
      name: 'Corn-fed Roasted Chicken', 
      description: 'Free-range chicken breast with wild mushroom sauce.', 
      price: 21, 
      category: 'main', 
      isAvailable: true, 
      image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80' 
    },
    { 
      name: 'Triple-Cooked Chips', 
      description: 'Thick-cut Maris Piper potatoes, rosemary salt.', 
      price: 6, 
      category: 'side', 
      isAvailable: true, 
      image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=800&q=80' 
    },
    { 
      name: 'Truffled Mac & Cheese', 
      description: 'Mature Cheddar and black truffle oil.', 
      price: 8, 
      category: 'side', 
      isAvailable: true, 
      image: 'https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?auto=format&fit=crop&w=800&q=80' 
    },
    { 
      name: 'Sticky Toffee Pudding', 
      description: 'Warm date sponge with butterscotch sauce and clotted cream.', 
      price: 9, 
      category: 'pudding', 
      isAvailable: true, 
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80' 
    },
    { 
      name: 'English Strawberry Eton Mess', 
      description: 'Crushed meringue, Chantilly cream, and local strawberries.', 
      price: 8, 
      category: 'pudding', 
      isAvailable: true, 
      image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80' 
    },
    { 
      name: 'London Dry Gin & Tonic', 
      description: 'Premium gin with elderflower tonic and cucumber.', 
      price: 12, 
      category: 'beverage', 
      isAvailable: true, 
      image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?auto=format&fit=crop&w=800&q=80' 
    },
    { 
      name: 'Proper English Tea', 
      description: 'Breakfast blend served with milk and shortbread.', 
      price: 4, 
      category: 'beverage', 
      isAvailable: true, 
      image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&w=800&q=80' 
    },
  ];

  for (const branch of branches) {
    for (const item of menuItems) {
      const existing = await prisma.menuItem.findFirst({
        where: { name: item.name, branchId: branch.id }
      });

      if (existing) {
        await prisma.menuItem.update({
          where: { id: existing.id },
          data: item,
        });
      } else {
        await prisma.menuItem.create({
          data: { ...item, branch: { connect: { id: branch.id } } },
        });
      }
    }
  }
  console.log('Menu seeded!');
}

seedMenu().finally(() => prisma.$disconnect());