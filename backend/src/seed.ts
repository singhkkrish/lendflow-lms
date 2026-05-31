/**
 * Seed Script — creates one pre-built account per role.
 * Run with:  npm run seed
 *
 * Credentials for all accounts:
 *   Password: password123
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User';
import Loan from './models/Loan';
import Payment from './models/Payment';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lendflow';

const SEED_USERS = [
  { name: 'Rahul Sharma',   email: 'borrower@lendflow.io',     role: 'borrower'     },
  { name: 'Admin User',     email: 'admin@lendflow.io',        role: 'admin'        },
  { name: 'Sales Exec',     email: 'sales@lendflow.io',        role: 'sales'        },
  { name: 'Sanction Exec',  email: 'sanction@lendflow.io',     role: 'sanction'     },
  { name: 'Disburse Exec',  email: 'disbursement@lendflow.io', role: 'disbursement' },
  { name: 'Collection Exec',email: 'collection@lendflow.io',   role: 'collection'   },
  // Extra borrower with no loan (shows up in Sales leads)
  { name: 'Arjun Mehta',    email: 'arjun@email.com',          role: 'borrower'     },
  { name: 'Kavita Iyer',    email: 'kavita@email.com',         role: 'borrower'     },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  // Clear existing data
  await User.deleteMany({});
  await Loan.deleteMany({});
  await Payment.deleteMany({});
  console.log('🗑️  Cleared existing data');

  // Create users (password hashed by pre-save hook)
  const createdUsers = await Promise.all(
    SEED_USERS.map((u) => User.create({ ...u, password: 'password123' }))
  );
  console.log(`👥 Created ${createdUsers.length} users`);

  const borrower = createdUsers.find((u) => u.email === 'borrower@lendflow.io')!;
  const sanctionExec = createdUsers.find((u) => u.role === 'sanction')!;
  const disburseExec = createdUsers.find((u) => u.role === 'disbursement')!;
  const collectionExec = createdUsers.find((u) => u.role === 'collection')!;

  const today = new Date();

  // Loan 1 — CLOSED (fully repaid, shows full lifecycle)
  const loan1 = await Loan.create({
    applicationId: 'LF-0001-SEED01',
    borrower: borrower._id,
    fullName: 'Rahul Sharma', pan: 'ABCDE1234F',
    dateOfBirth: new Date('1990-03-15'),
    monthlySalary: 50000, employmentMode: 'salaried',
    amount: 150000, tenure: 180, interestRate: 12,
    interest: 8877, totalRepayment: 158877,
    status: 'closed',
    appliedAt: new Date(today.getTime() - 30 * 86400000),
    sanctionedAt: new Date(today.getTime() - 28 * 86400000),
    sanctionedBy: sanctionExec._id,
    disbursedAt: new Date(today.getTime() - 25 * 86400000),
    disbursedBy: disburseExec._id,
    closedAt: new Date(today.getTime() - 3 * 86400000),
  });

  await Payment.create([
    { loan: loan1._id, borrower: borrower._id, recordedBy: collectionExec._id, utrNumber: 'UTR202568427901', amount: 50000, paymentDate: new Date(today.getTime() - 25 * 86400000) },
    { loan: loan1._id, borrower: borrower._id, recordedBy: collectionExec._id, utrNumber: 'UTR202568420002', amount: 50000, paymentDate: new Date(today.getTime() - 10 * 86400000) },
    { loan: loan1._id, borrower: borrower._id, recordedBy: collectionExec._id, utrNumber: 'UTR202568430003', amount: 58877, paymentDate: new Date(today.getTime() - 3 * 86400000) },
  ]);

  // Loan 2 — DISBURSED (active, partially paid - shows in collection)
  const loan2 = await Loan.create({
    applicationId: 'LF-0002-SEED02',
    borrower: borrower._id,
    fullName: 'Rahul Sharma', pan: 'ABCDE1234F',
    dateOfBirth: new Date('1990-03-15'),
    monthlySalary: 50000, employmentMode: 'salaried',
    amount: 350000, tenure: 365, interestRate: 12,
    interest: 42000, totalRepayment: 392000,
    status: 'disbursed',
    appliedAt: new Date(today.getTime() - 20 * 86400000),
    sanctionedAt: new Date(today.getTime() - 18 * 86400000),
    sanctionedBy: sanctionExec._id,
    disbursedAt: new Date(today.getTime() - 15 * 86400000),
    disbursedBy: disburseExec._id,
  });

  await Payment.create([
    { loan: loan2._id, borrower: borrower._id, recordedBy: collectionExec._id, utrNumber: 'UTR202568430004', amount: 50000, paymentDate: new Date(today.getTime() - 10 * 86400000) },
    { loan: loan2._id, borrower: borrower._id, recordedBy: collectionExec._id, utrNumber: 'UTR202568430005', amount: 50000, paymentDate: new Date(today.getTime() - 2 * 86400000)  },
  ]);

  // Loan 3 — SANCTIONED (approved, waiting for disbursement)
  await Loan.create({
    applicationId: 'LF-0003-SEED03',
    borrower: borrower._id,
    fullName: 'Rahul Sharma', pan: 'ABCDE1234F',
    dateOfBirth: new Date('1990-03-15'),
    monthlySalary: 50000, employmentMode: 'salaried',
    amount: 200000, tenure: 190, interestRate: 12,
    interest: 12493, totalRepayment: 212493,
    status: 'sanctioned',
    appliedAt: new Date(today.getTime() - 5 * 86400000),
    sanctionedAt: new Date(today.getTime() - 1 * 86400000),
    sanctionedBy: sanctionExec._id,
  });

  // Extra borrowers — pending applications (visible in Sanction module)
  const extraBorrower1 = createdUsers.find((u) => u.email === 'arjun@email.com')!;
  await Loan.create({
    applicationId: 'LF-0004-SEED04',
    borrower: extraBorrower1._id,
    fullName: 'Arjun Mehta', pan: 'WXYZ5678G',
    dateOfBirth: new Date('1995-07-20'),
    monthlySalary: 65000, employmentMode: 'salaried',
    amount: 500000, tenure: 270, interestRate: 12,
    interest: 44383, totalRepayment: 544383,
    status: 'pending',
    appliedAt: new Date(today.getTime() - 2 * 86400000),
  });

  const extraBorrower2 = createdUsers.find((u) => u.email === 'kavita@email.com')!;
  await Loan.create({
    applicationId: 'LF-0005-SEED05',
    borrower: extraBorrower2._id,
    fullName: 'Kavita Iyer', pan: 'PQRST9012H',
    dateOfBirth: new Date('1992-11-05'),
    monthlySalary: 48000, employmentMode: 'self-employed',
    amount: 450000, tenure: 200, interestRate: 12,
    interest: 29589, totalRepayment: 479589,
    status: 'pending',
    appliedAt: new Date(today.getTime() - 1 * 86400000),
  });

  console.log('💳 Created seed loans and payments');

  console.log('\n✅ Seed complete!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  LOGIN CREDENTIALS (password: password123)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  SEED_USERS.slice(0, 6).forEach((u) => {
    console.log(`  ${u.role.padEnd(15)} → ${u.email}`);
  });
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
