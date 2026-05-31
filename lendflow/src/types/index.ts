export type UserRole =
  | 'borrower'
  | 'admin'
  | 'sales'
  | 'sanction'
  | 'disbursement'
  | 'collection';
 
export type LoanStatus =
  | 'pending'
  | 'sanctioned'
  | 'rejected'
  | 'disbursed'
  | 'closed';
 
export type EmploymentMode = 'salaried' | 'self-employed';
 
// ── User ─────────────────────────────────────────────────────────────────────
export interface User {
  _id: string;
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}
 
// ── Loan ─────────────────────────────────────────────────────────────────────
export interface Loan {
  _id: string;
  applicationId: string;
  borrower: User | string;
 
  // Personal details
  fullName: string;
  pan: string;
  dateOfBirth: string;
  monthlySalary: number;
  employmentMode: EmploymentMode;
 
  // Document
  salarySlipUrl?: string;
 
  // Loan config
  amount: number;
  tenure: number;
  interestRate: number;
  interest: number;
  totalRepayment: number;
 
  // Lifecycle
  status: LoanStatus;
  rejectionReason?: string;
 
  appliedAt: string;
  sanctionedAt?: string;
  disbursedAt?: string;
  closedAt?: string;
 
  sanctionedBy?: User | string;
  disbursedBy?: User | string;
 
  createdAt: string;
  updatedAt: string;
}
 
// ── Payment ──────────────────────────────────────────────────────────────────
export interface Payment {
  _id: string;
  loan: string;
  borrower: string;
  recordedBy: User | string;
  utrNumber: string;
  amount: number;
  paymentDate: string;
  createdAt: string;
}
 
// ── Extended Loan with payment info ──────────────────────────────────────────
export interface LoanWithPayments extends Loan {
  totalPaid: number;
  outstanding: number;
  recentPayments?: Payment[];
}
 
// ── API Response shapes ───────────────────────────────────────────────────────
export interface AuthResponse {
  token: string;
  user: User;
}
 
export interface LoansResponse {
  loans: LoanWithPayments[];
}
 
export interface LoanDetailResponse {
  loan: Loan;
  payments: Payment[];
  totalPaid: number;
  outstanding: number;
}
 
export interface SanctionLoansResponse {
  loans: Loan[];
  count: number;
}
 
export interface AdminLoansResponse {
  loans: Loan[];
  pagination: { page: number; limit: number; total: number; pages: number };
  kpis: {
    totalApplications: number;
    totalDisbursed: number;
    totalCollected: number;
    activeLoans: number;
  };
}
 
export interface LeadsResponse {
  users: User[];
  pagination: { page: number; limit: number; total: number; pages: number };
}
 
export interface PaymentResponse {
  payment: Payment;
  totalPaid: number;
  outstanding: number;
  loanClosed: boolean;
  message: string;
}
 
export interface UploadResponse {
  url: string;
  originalName: string;
  size: number;
  message: string;
}
 
// ── BRE ──────────────────────────────────────────────────────────────────────
export interface BREError {
  field: string;
  message: string;
}
export interface BREInput {
  dob: string;
  salary: number;
  pan: string;
  employment: string;
}

export interface BREResult {
  eligible: boolean;
  errors: string[];
}
 
// ── Loan Apply Payload ────────────────────────────────────────────────────────
export interface LoanApplyPayload {
  fullName: string;
  pan: string;
  dateOfBirth: string;
  monthlySalary: number;
  employmentMode: EmploymentMode;
  salarySlipUrl?: string;
  amount: number;
  tenure: number;
}
// ── Legacy Demo Types (used by constants.ts) ────────────────────────────────
export type Role =
  | 'Borrower'
  | 'Admin'
  | 'Sales'
  | 'Sanction'
  | 'Disbursement'
  | 'Collection';

export interface Lead {
  name: string;
  email: string;
  registered: string;
  color: string;
}
