import { Router, Response } from 'express';
import Payment from '../models/Payment';
import Loan from '../models/Loan';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = Router();

// POST /api/payments  — record a payment (collection role)
router.post(
  '/',
  authenticate,
  authorize('collection'),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { loanId, utrNumber, amount, paymentDate } = req.body;

      if (!loanId || !utrNumber || !amount) {
        res.status(400).json({ message: 'loanId, utrNumber, and amount are required.' });
        return;
      }

      // Fetch loan and validate status
      const loan = await Loan.findById(loanId);
      if (!loan) {
        res.status(404).json({ message: 'Loan not found.' });
        return;
      }
      if (loan.status !== 'disbursed') {
        res.status(409).json({ message: `Cannot record payment for a loan with status "${loan.status}".` });
        return;
      }

      // UTR must be globally unique
      const existing = await Payment.findOne({ utrNumber: utrNumber.trim() });
      if (existing) {
        res.status(409).json({ message: 'UTR number already exists. Each payment must have a unique UTR.' });
        return;
      }

      // Calculate how much has been paid so far
      const prevPayments = await Payment.find({ loan: loanId });
      const totalPaidSoFar = prevPayments.reduce((sum, p) => sum + p.amount, 0);
      const outstanding = loan.totalRepayment - totalPaidSoFar;

      if (amount <= 0) {
        res.status(400).json({ message: 'Payment amount must be greater than 0.' });
        return;
      }
      if (amount > outstanding) {
        res.status(400).json({
          message: `Payment amount (₹${amount}) exceeds outstanding balance (₹${outstanding}).`,
          outstanding,
        });
        return;
      }

      // Create the payment
      const payment = await Payment.create({
        loan: loanId,
        borrower: loan.borrower,
        recordedBy: req.user!.id,
        utrNumber: utrNumber.trim(),
        amount,
        paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
      });

      // Auto-close if fully paid
      const newTotalPaid = totalPaidSoFar + amount;
      let closed = false;
      if (newTotalPaid >= loan.totalRepayment) {
        loan.status = 'closed';
        loan.closedAt = new Date();
        await loan.save();
        closed = true;
      }

      res.status(201).json({
        payment,
        totalPaid: newTotalPaid,
        outstanding: Math.max(0, loan.totalRepayment - newTotalPaid),
        loanClosed: closed,
        message: closed
          ? '🎉 Payment recorded. Loan fully repaid and closed!'
          : 'Payment recorded successfully.',
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error.' });
    }
  }
);

// GET /api/payments/loan/:loanId  — all payments for a loan
router.get(
  '/loan/:loanId',
  authenticate,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const loan = await Loan.findById(req.params.loanId);
      if (!loan) {
        res.status(404).json({ message: 'Loan not found.' });
        return;
      }

      // Borrower can only see their own payments
      if (
        req.user!.role === 'borrower' &&
        loan.borrower.toString() !== req.user!.id
      ) {
        res.status(403).json({ message: 'Access denied.' });
        return;
      }

      const payments = await Payment.find({ loan: req.params.loanId })
        .populate('recordedBy', 'name email')
        .sort({ paymentDate: -1 });

      const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

      res.json({
        payments,
        totalPaid,
        outstanding: Math.max(0, loan.totalRepayment - totalPaid),
      });
    } catch {
      res.status(500).json({ message: 'Server error.' });
    }
  }
);

export default router;
