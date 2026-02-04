/**
 * Order Management Controller
 * Order Workflow:
 * PENDING → CONFIRMED → PREPARING → READY → DELIVERED/COMPLETED
 */

import { Request, Response } from 'express';
import { handleError } from '../utils/errorHandler';
import prisma from '../utils/prisma';
import { OrderStatus } from '@prisma/client';

/**
 * @param req - Request with query parameters for filtering
 * @param res - Response with filtered order list
 */
export const getOrders = async (req: Request, res: Response) => {
    try {
        const { branchId, status, customerId } = req.query;
        const user = req.user;
        const whereClause: any = {};

        // Apply role-based filtering to ensure users only see appropriate orders
        if (user?.role === 'CHEF' || user?.role === 'CASHIER') {
            // Kitchen and front-of-house staff see orders from their branch only
            if (user.branchId) {
                whereClause.branchId = user.branchId;
            }
        } else if (user?.role === 'CUSTOMER') {
            // Customers can only see their own orders for privacy
            whereClause.customerId = user.id;
        } else if (user?.role === 'BRANCH_MANAGER') {
            // Branch managers see all orders within their branch
            if (user.branchId) {
                whereClause.branchId = user.branchId;
            }
        }

        // Apply additional query filters (only for authorized roles)
        if (branchId && (user?.role === 'ADMIN' || user?.role === 'GENERAL_MANAGER')) {
            whereClause.branchId = Number(branchId);
        }
        if (status) whereClause.status = status;
        if (customerId && (user?.role === 'ADMIN' || user?.role === 'GENERAL_MANAGER' || user?.role === 'BRANCH_MANAGER')) {
            whereClause.customerId = Number(customerId);
        }

        // Fetch orders with comprehensive related data
        const orders = await prisma.order.findMany({
            where: whereClause,
            include: {
                customer: {
                    select: {
                        username: true,
                        email: true // Include customer info for staff
                    }
                },
                items: {
                    include: {
                        menuItem: true // Include full menu item details
                    }                },
                payment: true // Include payment information if available
            },
            orderBy: {
                createdAt: 'desc' // Show newest orders first
            }
        });

        return res.json(orders);
    } catch (error) {
        return handleError(error, res);
    }
};

/**
 * Create New Order
 * @param req - Request with order data (items, delivery address, etc.)
 * @param res - Response with created order or error message
 */
export const createOrder = async (req: Request, res: Response) => {
    try {
        let { branchId, items, deliveryAddress, customerId } = req.body;
        const userId = req.user?.id;
        const userRole = req.user?.role;

        // Ensure user is authenticated
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required' });
        }        // Determine the actual customer ID based on user role and business rules
        let actualCustomerId = customerId;
        if (userRole === 'CUSTOMER') {
            // Customers can only create orders for themselves (security measure)
            actualCustomerId = userId;
        } else if (userRole === 'CASHIER') {
            // Cashiers can create orders for any customer or walk-in customers
            // If no customerId provided, create a walk-in order using cashier's ID as placeholder
            actualCustomerId = customerId || userId; // Use provided customer ID or cashier ID for walk-ins
        } else if (userRole === 'BRANCH_MANAGER' || userRole === 'ADMIN' || userRole === 'GENERAL_MANAGER') {
            // Managers can create orders for any customer
            actualCustomerId = customerId || userId;
        } else {
            return res.status(403).json({ message: 'Insufficient permissions to create orders' });
        }

        // Validate that order contains items
        if (!items?.length) {
            return res.status(400).json({ message: 'Order must contain at least one item' });
        }

        // Intelligent branch assignment: if no branch specified, find closest by address
        if (!branchId && deliveryAddress) {
            const branches = await prisma.branch.findMany();
            if (!branches.length) {
                return res.status(400).json({ message: 'No branches available' });
            }
            
            // Simple address matching algorithm (can be enhanced with geocoding API)
            const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
            const input = normalize(deliveryAddress);
            let best = branches[0];
            let bestScore = 0;
            
            for (const branch of branches) {
                const branchNorm = normalize(branch.address || '');
                let score = 0;
                
                // Calculate similarity score based on character matching
                for (let i = 0; i < Math.min(branchNorm.length, input.length); i++) {
                    if (branchNorm[i] === input[i]) score++;
                }
                
                if (score > bestScore) {
                    best = branch;
                    bestScore = score;
                }
            }
            branchId = best.id;
        }

        if (!branchId) {
            return res.status(400).json({ message: 'No branchId or delivery address provided' });
        }

        // Validate branch exists before processing order
        const branch = await prisma.branch.findUnique({
            where: { id: Number(branchId) }
        });

        if (!branch) {
            const availableBranches = await prisma.branch.findMany({
                select: { id: true, name: true, address: true }
            });
            return res.status(400).json({ 
                message: `Branch ${branchId} not found`,
                availableBranches: availableBranches
            });
        }

        // Process order items: validate and calculate totals
        const orderItems = [];
        let totalAmount = 0;

        for (const item of items) {
            // Validate menu item exists and is available
            const menuItem = await prisma.menuItem.findUnique({
                where: { id: item.menuItemId }
            });

            if (!menuItem) {
                return res.status(404).json({ 
                    message: `Menu item ${item.menuItemId} not found` 
                });
            }

            if (!menuItem.isAvailable) {
                return res.status(400).json({ 
                    message: `Menu item ${menuItem.name} is not available` 
                });
            }

            // Calculate subtotal using current menu pricing (server-side calculation for security)
            const subtotal = menuItem.price * item.quantity;
            totalAmount += subtotal;

            orderItems.push({
                menuItemId: menuItem.id,
                quantity: item.quantity,
                unitPrice: menuItem.price,
                subtotal
            });
        }

        // Create order
        const order = await prisma.order.create({
            data: {
                branchId: Number(branchId),
                customerId: actualCustomerId,
                status: 'PENDING' as OrderStatus,
                totalAmount,
                deliveryAddress: deliveryAddress || null,
                items: {
                    create: orderItems
                }
            },
            include: {
                items: {
                    include: {
                        menuItem: true
                    }
                }
            }
        });

        return res.status(201).json(order);
    } catch (error) {
        return handleError(error, res);
    }
};

// Update order status
export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const user = req.user!;

    // Get current order
    const currentOrder = await prisma.order.findUnique({
      where: { id: Number(id) },
      include: { payment: true }
    });

    // BRANCH ISOLATION CHECK: Ensure user can only access orders from their branch
    if (user.role !== 'ADMIN' && user.role !== 'GENERAL_MANAGER') {
      if (!user.branchId || currentOrder?.branchId !== user.branchId) {
        res.status(403).json({ message: 'Unauthorized: You can only update orders from your branch' });
        return;
      }
    }

    // Validate status update based on user role
    if (user.role === 'CHEF' && !['PREPARING', 'READY', 'CANCELLED'].includes(status)) {
      res.status(403).json({ message: 'Chefs can only mark orders as preparing, ready, or cancelled' });
      return;
    }

    if (user.role === 'CASHIER' && !['DELIVERED', 'CANCELLED'].includes(status)) {
      res.status(403).json({ message: 'Cashiers can only mark orders as delivered or cancelled' });
      return;
    }

    if (!currentOrder) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    // Validate status transition
    const validTransitions: Record<string, string[]> = {
      PENDING: ['PREPARING', 'CANCELLED', 'DELIVERED'], // Allow direct delivery
      PREPARING: ['READY', 'CANCELLED'],
      READY: ['DELIVERED', 'CANCELLED'],
      DELIVERED: [],
      CANCELLED: []
    };

    if (!validTransitions[currentOrder.status].includes(status)) {
      res.status(400).json({
        message: `Cannot transition from ${currentOrder.status} to ${status}`
      });
      return;
    }

    // If cancelling and payment exists, initiate refund
    if (status === 'CANCELLED' && currentOrder.payment) {
      await prisma.payment.update({
        where: { id: currentOrder.payment.id },
        data: { status: 'REFUNDED' }
      });
    }

    const order = await prisma.order.update({
      where: { id: Number(id) },
      data: { status },
      include: {
        items: {
          include: {
            menuItem: true
          }
        },
        payment: true
      }
    });

    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Error in updateOrderStatus:', error);
    res.status(500).json({ message: 'Error updating order status' });
  }
};

// Delete order (admin and branch manager only)
export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
  try {    const { id } = req.params;
    const user = req.user as { id: number; role: string; branchId?: number };

    const order = await prisma.order.findUnique({
      where: { id: Number(id) },
      include: { payment: true }
    });

    // Check user authorization
    if (!['ADMIN', 'BRANCH_MANAGER'].includes(user.role)) {
      res.status(403).json({ message: 'Unauthorized to delete orders' });
      return;
    }

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    // BRANCH ISOLATION CHECK: Branch managers can only delete orders from their branch
    if (user.role === 'BRANCH_MANAGER' && (!user.branchId || order.branchId !== user.branchId)) {
      res.status(403).json({ message: 'Unauthorized: You can only delete orders from your branch' });
      return;
    }

    // Only allow deletion of non-delivered orders
    if (order.status === 'DELIVERED') {
      res.status(400).json({ message: 'Cannot delete delivered orders' });
      return;
    }

    // If payment exists, mark as refunded
    if (order.payment) {
      await prisma.payment.update({
        where: { id: order.payment.id },
        data: { status: 'REFUNDED' }
      });
    }

    await prisma.order.delete({
      where: { id: Number(id) }
    });

    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error in deleteOrder:', error);
    res.status(500).json({ message: 'Error deleting order' });
  }
};