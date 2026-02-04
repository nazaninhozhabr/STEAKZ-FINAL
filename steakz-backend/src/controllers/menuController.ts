import { Request, Response } from 'express';
import prisma from '../utils/prisma';

/**
 * Query Parameters:
 * - branchId (optional): Filter items by branch availability
 * 
 * @param req - Request with optional branchId query parameter
 * @param res - Response with menu items and ingredient details
 */
export const getMenuItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const { branchId } = req.query;
    const user = req.user;

    let targetBranchId: number | undefined;

    if (user) {
      if (['CHEF', 'CASHIER', 'BRANCH_MANAGER'].includes(user.role)) {
        if (!user.branchId) {
          res.status(400).json({ message: 'User must be assigned to a branch' });
          return;
        }
        targetBranchId = user.branchId;
      } else if (user.role === 'CUSTOMER') {
        if (!branchId) {
          res.status(400).json({ message: 'Branch ID is required' });
          return;
        }
        targetBranchId = Number(branchId);
      } else if (user.role === 'ADMIN' || user.role === 'GENERAL_MANAGER') {
        targetBranchId = branchId ? Number(branchId) : undefined;
      }
    } else if (branchId) {
      targetBranchId = Number(branchId);
    } else {
      res.status(400).json({ message: 'Branch ID is required' });
      return;
    }
    
    // Build query with optional branch filtering
    const menuItems = await prisma.menuItem.findMany({
      where: targetBranchId ? {
        branchId: targetBranchId
      } : undefined,
      include: {
        ingredients: {
          select: {
            id: true,
            name: true,
            quantity: true,
            unit: true,
          }
        }
      },
      orderBy: { name: 'asc' } // Sort alphabetically for easy browsing
    });

    res.json(menuItems);
  } catch (error) {
    console.error('Error in getMenuItems:', error);
    res.status(500).json({ message: 'Error fetching menu items' });
  }
};

/**
 * Create New Menu Item
 * @param req - Request with menu item data and ingredient associations
 * @param res - Response with created menu item or error
 */
export const createMenuItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, price, category, ingredients, branchId } = req.body;
    const user = req.user!;

    let targetBranchId: number | undefined;

    if (user.role === 'BRANCH_MANAGER') {
      targetBranchId = Number(branchId || user.branchId);
      if (!targetBranchId || targetBranchId !== user.branchId) {
        res.status(403).json({ message: 'You can only create menu items for your branch' });
        return;
      }
    } else if (user.role === 'ADMIN' || user.role === 'GENERAL_MANAGER') {
      targetBranchId = Number(branchId);
    }

    if (!targetBranchId) {
      res.status(400).json({ message: 'Branch ID is required' });
      return;
    }

    // Comprehensive input validation
    if (!name?.trim() || !description?.trim() || !price || !category?.trim()) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    // Create menu item with ingredient connections
    const menuItem = await prisma.menuItem.create({
      data: {
        name: name.trim(),
        description: description.trim(),
        price: parseFloat(price),
        category: category.trim(),
        branch: { connect: { id: targetBranchId } },
        ingredients: {
          connect: ingredients.map((id: number) => ({ id }))
        }
      },
      include: {
        ingredients: {
          select: {
            id: true,
            name: true,
            quantity: true,
            unit: true,
          }
        }
      }
    });

    res.status(201).json({
      message: 'Menu item created successfully',
      menuItem
    });
  } catch (error) {
    console.error('Error in createMenuItem:', error);
    res.status(500).json({ message: 'Error creating menu item' });
  }
};

// Update menu item
export const updateMenuItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, price, category, isAvailable, ingredients } = req.body;
    const user = req.user!;

    const existingMenuItem = await prisma.menuItem.findUnique({
      where: { id: Number(id) }
    });

    if (!existingMenuItem) {
      res.status(404).json({ message: 'Menu item not found' });
      return;
    }

    if (user.role === 'BRANCH_MANAGER' && existingMenuItem.branchId !== user.branchId) {
      res.status(403).json({ message: 'You can only update menu items for your branch' });
      return;
    }

    // Prepare update data
    const updateData: any = {};
    
    if (name?.trim()) updateData.name = name.trim();
    if (description?.trim()) updateData.description = description.trim();
    if (price) updateData.price = parseFloat(price);
    if (category?.trim()) updateData.category = category.trim();
    if (typeof isAvailable === 'boolean') updateData.isAvailable = isAvailable;
    
    if (ingredients?.length >= 0) {
      updateData.ingredients = {
        set: [], // Clear existing connections
        connect: ingredients.map((id: number) => ({ id })) // Add new connections
      };
    }

    const menuItem = await prisma.menuItem.update({
      where: { id: Number(id) },
      data: updateData,
      include: {
        ingredients: {
          select: {
            id: true,
            name: true,
            quantity: true,
            unit: true,
          }
        }
      }
    });

    res.json({
      message: 'Menu item updated successfully',
      menuItem
    });
  } catch (error) {
    console.error('Error in updateMenuItem:', error);
    res.status(500).json({ message: 'Error updating menu item' });
  }
};

// Delete menu item
export const deleteMenuItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = req.user!;

    const existingMenuItem = await prisma.menuItem.findUnique({
      where: { id: Number(id) }
    });

    if (!existingMenuItem) {
      res.status(404).json({ message: 'Menu item not found' });
      return;
    }

    if (user.role === 'BRANCH_MANAGER' && existingMenuItem.branchId !== user.branchId) {
      res.status(403).json({ message: 'You can only delete menu items for your branch' });
      return;
    }

    await prisma.menuItem.delete({
      where: { id: Number(id) }
    });

    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('Error in deleteMenuItem:', error);
    res.status(500).json({ message: 'Error deleting menu item' });
  }
};