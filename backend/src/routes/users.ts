import { Router, Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/User';
import Loan from '../models/Loan';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/users/leads
// Sales module: registered borrowers who have NOT applied for any loan
router.get(
  '/leads',
  authenticate,
  authorize('sales'),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = (req.query.search as string) || '';
      const skip = (page - 1) * limit;

      // Find all borrower IDs who have at least one loan application
      const appliedBorrowerIds = await Loan.distinct('borrower');

      const query: Record<string, unknown> = {
        role: 'borrower',
        _id: { $nin: appliedBorrowerIds },
      };

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ];
      }

      const [users, total] = await Promise.all([
        User.find(query).select('-password').skip(skip).limit(limit).sort({ createdAt: -1 }),
        User.countDocuments(query),
      ]);

      res.json({
        users,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      });
    } catch {
      res.status(500).json({ message: 'Server error.' });
    }
  }
);

// GET /api/users  (admin only — all users)
router.get(
  '/',
  authenticate,
  authorize('admin'),
  async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
      const users = await User.find().select('-password').sort({ createdAt: -1 });
      res.json({ users });
    } catch {
      res.status(500).json({ message: 'Server error.' });
    }
  }
);

export default router;
