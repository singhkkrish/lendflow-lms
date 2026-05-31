import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

function signToken(payload: { id: string; role: string; name: string; email: string }) {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET || 'fallback_secret',
    {
      expiresIn: '7d',
    }
  );
}

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: 'Name, email, and password are required.' });
      return;
    }

    // Prevent creating admin/ops accounts via public register
    const allowedPublicRoles = ['borrower'];
    const assignedRole = allowedPublicRoles.includes(role) ? role : 'borrower';

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      res.status(409).json({ message: 'Email already in use.' });
      return;
    }

    const user = await User.create({ name, email, password, role: assignedRole });
    const token = signToken({ id: user._id.toString(), role: user.role, name: user.name, email: user.email });

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required.' });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials.' });
      return;
    }

    const match = await user.comparePassword(password);
    if (!match) {
      res.status(401).json({ message: 'Invalid credentials.' });
      return;
    }

    const token = signToken({ id: user._id.toString(), role: user.role, name: user.name, email: user.email });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// GET /api/auth/me  — returns current user from token
router.get('/me', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user!.id).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }
    res.json({ user });
  } catch {
    res.status(500).json({ message: 'Server error.' });
  }
});

export default router;
