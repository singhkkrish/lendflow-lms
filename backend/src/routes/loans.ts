import { Router, Response } from 'express';
import Loan from '../models/Loan';
import Payment from '../models/Payment';
import { runBRE, calculateSI } from '../lib/bre';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = Router();

// ── BORROWER ─────────────────────────────────────────────────────────────────

// POST /api/loans/apply  — borrower submits an application
router.post(
  '/apply',
  authenticate,
  authorize('borrower'),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const {
        fullName, pan, dateOfBirth, monthlySalary, employmentMode,
        amount, tenure, salarySlipUrl,
      } = req.body;

      // Server-side BRE — source of truth
      const breResult = runBRE({ dateOfBirth, monthlySalary, pan, employmentMode });
      if (!breResult.passed) {
        res.status(422).json({ message: 'BRE check failed.', errors: breResult.errors });
        return;
      }

      // Validate loan config
      if (amount < 50000 || amount > 500000) {
        res.status(400).json({ message: 'Loan amount must be between ₹50,000 and ₹5,00,000.' });
        return;
      }
      if (tenure < 30 || tenure > 365) {
        res.status(400).json({ message: 'Tenure must be between 30 and 365 days.' });
        return;
      }

      const { interest, totalRepayment } = calculateSI(amount, tenure);

      const loan = await Loan.create({
        borrower: req.user!.id,
        fullName, pan: pan.toUpperCase(), dateOfBirth, monthlySalary, employmentMode,
        salarySlipUrl,
        amount, tenure, interestRate: 12, interest, totalRepayment,
        status: 'pending',
        appliedAt: new Date(),
      });

      res.status(201).json({ loan, message: 'Application submitted successfully.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error.' });
    }
  }
);

// GET /api/loans/my  — borrower's own loans
router.get(
  '/my',
  authenticate,
  authorize('borrower'),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const loans = await Loan.find({ borrower: req.user!.id }).sort({ createdAt: -1 });

      // Attach payment summary to each loan
      const loansWithPayments = await Promise.all(
        loans.map(async (loan) => {
          const payments = await Payment.find({ loan: loan._id }).sort({ paymentDate: -1 });
          const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
          return {
            ...loan.toJSON(),
            totalPaid,
            outstanding: Math.max(0, loan.totalRepayment - totalPaid),
            recentPayments: payments.slice(0, 3),
          };
        })
      );

      res.json({ loans: loansWithPayments });
    } catch {
      res.status(500).json({ message: 'Server error.' });
    }
  }
);

// GET /api/loans/:id  — single loan detail (borrower owns it OR ops role)
router.get(
  '/:id',
  authenticate,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const loan = await Loan.findById(req.params.id)
        .populate('borrower', 'name email createdAt')
        .populate('sanctionedBy', 'name email')
        .populate('disbursedBy', 'name email');

      if (!loan) {
        res.status(404).json({ message: 'Loan not found.' });
        return;
      }

      // Borrower can only see their own loan
      if (
        req.user!.role === 'borrower' &&
        loan.borrower._id.toString() !== req.user!.id
      ) {
        res.status(403).json({ message: 'Access denied.' });
        return;
      }

      const payments = await Payment.find({ loan: loan._id })
        .populate('recordedBy', 'name')
        .sort({ paymentDate: -1 });

      const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

      res.json({
        loan,
        payments,
        totalPaid,
        outstanding: Math.max(0, loan.totalRepayment - totalPaid),
      });
    } catch {
      res.status(500).json({ message: 'Server error.' });
    }
  }
);

// ── SANCTION MODULE ──────────────────────────────────────────────────────────

// GET /api/loans/ops/sanction  — list all pending applications
router.get(
  '/ops/sanction',
  authenticate,
  authorize('sanction'),
  async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
      const loans = await Loan.find({ status: 'pending' })
        .populate('borrower', 'name email')
        .sort({ appliedAt: 1 });
      res.json({ loans, count: loans.length });
    } catch {
      res.status(500).json({ message: 'Server error.' });
    }
  }
);

// PATCH /api/loans/:id/sanction  — approve or reject
router.patch(
  '/:id/sanction',
  authenticate,
  authorize('sanction'),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { action, rejectionReason } = req.body; // action: 'approve' | 'reject'

      if (!['approve', 'reject'].includes(action)) {
        res.status(400).json({ message: 'Action must be "approve" or "reject".' });
        return;
      }

      const loan = await Loan.findById(req.params.id);
      if (!loan) {
        res.status(404).json({ message: 'Loan not found.' });
        return;
      }
      if (loan.status !== 'pending') {
        res.status(409).json({ message: `Cannot sanction a loan with status "${loan.status}".` });
        return;
      }

      if (action === 'approve') {
        loan.status = 'sanctioned';
        loan.sanctionedAt = new Date();
        loan.sanctionedBy = req.user!.id as unknown as typeof loan.sanctionedBy;
      } else {
        if (!rejectionReason) {
          res.status(400).json({ message: 'Rejection reason is required.' });
          return;
        }
        loan.status = 'rejected';
        loan.rejectionReason = rejectionReason;
      }

      await loan.save();
      res.json({ loan, message: `Loan ${action === 'approve' ? 'sanctioned' : 'rejected'} successfully.` });
    } catch {
      res.status(500).json({ message: 'Server error.' });
    }
  }
);

// ── DISBURSEMENT MODULE ──────────────────────────────────────────────────────

// GET /api/loans/ops/disbursement  — sanctioned loans ready to disburse
router.get(
  '/ops/disbursement',
  authenticate,
  authorize('disbursement'),
  async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
      const loans = await Loan.find({ status: 'sanctioned' })
        .populate('borrower', 'name email')
        .sort({ sanctionedAt: 1 });
      res.json({ loans, count: loans.length });
    } catch {
      res.status(500).json({ message: 'Server error.' });
    }
  }
);

// PATCH /api/loans/:id/disburse
router.patch(
  '/:id/disburse',
  authenticate,
  authorize('disbursement'),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const loan = await Loan.findById(req.params.id);
      if (!loan) {
        res.status(404).json({ message: 'Loan not found.' });
        return;
      }
      if (loan.status !== 'sanctioned') {
        res.status(409).json({ message: `Cannot disburse a loan with status "${loan.status}".` });
        return;
      }

      loan.status = 'disbursed';
      loan.disbursedAt = new Date();
      loan.disbursedBy = req.user!.id as unknown as typeof loan.disbursedBy;
      await loan.save();

      res.json({ loan, message: 'Loan disbursed successfully.' });
    } catch {
      res.status(500).json({ message: 'Server error.' });
    }
  }
);

// ── COLLECTION MODULE ────────────────────────────────────────────────────────

// GET /api/loans/ops/collection  — active (disbursed) loans
router.get(
  '/ops/collection',
  authenticate,
  authorize('collection'),
  async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
      const loans = await Loan.find({ status: { $in: ['disbursed', 'closed'] } })
        .populate('borrower', 'name email')
        .sort({ disbursedAt: -1 });

      const loansWithPayments = await Promise.all(
        loans.map(async (loan) => {
          const payments = await Payment.find({ loan: loan._id }).sort({ paymentDate: -1 });
          const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
          return {
            ...loan.toJSON(),
            totalPaid,
            outstanding: Math.max(0, loan.totalRepayment - totalPaid),
            recentPayments: payments.slice(0, 5),
          };
        })
      );

      res.json({ loans: loansWithPayments, count: loansWithPayments.length });
    } catch {
      res.status(500).json({ message: 'Server error.' });
    }
  }
);

// ── ADMIN ────────────────────────────────────────────────────────────────────

// GET /api/loans  — all loans for admin dashboard
router.get(
  '/',
  authenticate,
  authorize('admin'),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const status = req.query.status as string;
      const skip = (page - 1) * limit;

      const query: Record<string, unknown> = {};
      if (status && status !== 'all') query.status = status;

      const [loans, total] = await Promise.all([
        Loan.find(query)
          .populate('borrower', 'name email')
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 }),
        Loan.countDocuments(query),
      ]);

      // Dashboard KPIs
      const [totalCount, disbursedSum, collectedSum, activeCount] = await Promise.all([
        Loan.countDocuments(),
        Loan.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
        Payment.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
        Loan.countDocuments({ status: 'disbursed' }),
      ]);

      res.json({
        loans,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        kpis: {
          totalApplications: totalCount,
          totalDisbursed: disbursedSum[0]?.total || 0,
          totalCollected: collectedSum[0]?.total || 0,
          activeLoans: activeCount,
        },
      });
    } catch {
      res.status(500).json({ message: 'Server error.' });
    }
  }
);

export default router;
