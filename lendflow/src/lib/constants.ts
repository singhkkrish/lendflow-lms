import { Loan, Lead, Role } from '@/types';

// ── Role meta ─────────────────────────────────────────────────────────────────
export const ROLES_META: Record<string, { color: string; bg: string }> = {
  Borrower:     { color: '#6366f1', bg: '#eef2ff' },
  Admin:        { color: '#8b5cf6', bg: '#f3e8ff' },
  Sales:        { color: '#3b82f6', bg: '#dbeafe' },
  Sanction:     { color: '#f59e0b', bg: '#fef3c7' },
  Disbursement: { color: '#10b981', bg: '#d1fae5' },
  Collection:   { color: '#ef4444', bg: '#fee2e2' },
};

export const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  Pending:    { bg: '#fef3c7', text: '#92400e', dot: '#f59e0b' },
  Sanctioned: { bg: '#dbeafe', text: '#1e40af', dot: '#3b82f6' },
  Active:     { bg: '#d1fae5', text: '#065f46', dot: '#10b981' },
  Closed:     { bg: '#f3f4f6', text: '#374151', dot: '#6b7280' },
  Rejected:   { bg: '#fee2e2', text: '#991b1b', dot: '#ef4444' },
};

// ── Demo credentials ──────────────────────────────────────────────────────────
export const DEMO_CREDS = [
  { role: 'Borrower'     as Role, email: 'borrower@lendflow.io'     },
  { role: 'Admin'        as Role, email: 'admin@lendflow.io'        },
  { role: 'Sales'        as Role, email: 'sales@lendflow.io'        },
  { role: 'Sanction'     as Role, email: 'sanction@lendflow.io'     },
  { role: 'Disbursement' as Role, email: 'disbursement@lendflow.io' },
  { role: 'Collection'   as Role, email: 'collection@lendflow.io'   },
];

// ── Initial loan data ─────────────────────────────────────────────────────────
export const INIT_LOANS: Loan[] = [
  {
    id: 'APP_001', borrower: 'Karan Malhotra', email: 'karan@email.com',
    amount: 450000, tenure: 200, salary: 65000, pan: 'QBFRT7890S',
    status: 'Pending', date: '28 May 2026', payments: [],
  },
  {
    id: 'APP_002', borrower: 'Vikram Mehta', email: 'vikram@email.com',
    amount: 500000, tenure: 270, salary: 65000, pan: 'XYZAB5678C',
    status: 'Pending', date: '26 May 2026', payments: [],
  },
  {
    id: 'APP_003', borrower: 'Sanya Kapoor', email: 'sanya@email.com',
    amount: 180000, tenure: 120, salary: 45000, pan: 'MNOPQ2345R',
    status: 'Rejected', date: '27 May 2026', payments: [],
    reason: 'Insufficient salary documentation',
  },
  {
    id: 'APP_004', borrower: 'Rahul Sharma', email: 'borrower@lendflow.io',
    amount: 260000, tenure: 190, salary: 80000, pan: 'ABCDE1234F',
    status: 'Sanctioned', date: '10 May 2026', approvedOn: '11 May 2026', payments: [],
  },
  {
    id: 'APP_005', borrower: 'Rahul Sharma', email: 'borrower@lendflow.io',
    amount: 350000, tenure: 180, salary: 80000, pan: 'ABCDE1234F',
    status: 'Active', date: '1 May 2026', disbursedOn: '3 May 2026',
    payments: [
      { id: 'PAY_001', utr: 'UTR282e69538002', amount: 50000, date: '31 May 2026', recordedBy: 'Collection Officer' },
      { id: 'PAY_002', utr: 'UTR282e69420982', amount: 50000, date: '7 May 2026',  recordedBy: 'Collection Officer' },
    ],
  },
];

// ── Leads ─────────────────────────────────────────────────────────────────────
export const LEADS: Lead[] = [
  { name: 'Arjun Mehta',  email: 'arjun@email.com',  registered: '25 May 2026', color: '#6366f1' },
  { name: 'Kavita Iyer',  email: 'kavita@email.com', registered: '24 May 2026', color: '#8b5cf6' },
  { name: 'Rohan Desai',  email: 'rohan@email.com',  registered: '22 May 2026', color: '#3b82f6' },
  { name: 'Ananya Joshi', email: 'ananya@email.com', registered: '21 May 2026', color: '#10b981' },
  { name: 'Dev Patel',    email: 'dev@email.com',    registered: '20 May 2026', color: '#f59e0b' },
  { name: 'Ishita Rao',   email: 'ishita@email.com', registered: '19 May 2026', color: '#ef4444' },
  { name: 'Neel Kumar',   email: 'neel@email.com',   registered: '18 May 2026', color: '#6366f1' },
  { name: 'Priya Nair',   email: 'priya@email.com',  registered: '17 May 2026', color: '#ec4899' },
];

// ── Sidebar nav ───────────────────────────────────────────────────────────────
export const OPS_NAV = [
  { id: 'dashboard',    label: 'Dashboard',    roles: ['Admin'] },
  { id: 'sales',        label: 'Sales',        roles: ['Admin', 'Sales'] },
  { id: 'sanction',     label: 'Sanction',     roles: ['Admin', 'Sanction'] },
  { id: 'disbursement', label: 'Disbursement', roles: ['Admin', 'Disbursement'] },
  { id: 'collection',   label: 'Collection',   roles: ['Admin', 'Collection'] },
];

// ── Slider config ─────────────────────────────────────────────────────────────
export const LOAN_AMOUNT_MARKS = [50000, 100000, 200000, 300000, 500000];
export const TENURE_MARKS = [
  { val: 30,  label: '1 Mo' },
  { val: 90,  label: '3 Mo' },
  { val: 180, label: '6 Mo' },
  { val: 270, label: '9 Mo' },
  { val: 365, label: '1 Yr' },
];
export const LOAN_AMOUNT_MIN = 50000;
export const LOAN_AMOUNT_MAX = 500000;
export const TENURE_MIN = 30;
export const TENURE_MAX = 365;
export const INTEREST_RATE = 12; // % per annum
