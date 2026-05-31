# LendFlow — Backend

Node.js + Express + TypeScript + MongoDB backend for the Loan Management System.

## Quick Start

```bash
cd backend
npm install

# Copy env and fill in your MongoDB URI
cp .env.example .env

# Seed the database (creates all role accounts + sample loans)
npm run seed

# Start dev server
npm run dev
```

Server runs at: `http://localhost:5000`

---

## Login Credentials (after seed)

| Role         | Email                      | Password    |
|--------------|----------------------------|-------------|
| Borrower     | borrower@lendflow.io       | password123 |
| Admin        | admin@lendflow.io          | password123 |
| Sales        | sales@lendflow.io          | password123 |
| Sanction     | sanction@lendflow.io       | password123 |
| Disbursement | disbursement@lendflow.io   | password123 |
| Collection   | collection@lendflow.io     | password123 |

---

## Folder Structure

```
backend/
├── src/
│   ├── server.ts          # Express app + DB connection
│   ├── seed.ts            # Seed script
│   ├── models/
│   │   ├── User.ts        # User + bcrypt password hashing
│   │   ├── Loan.ts        # Loan lifecycle model
│   │   └── Payment.ts     # Payment model (UTR unique)
│   ├── routes/
│   │   ├── auth.ts        # POST /register, POST /login, GET /me
│   │   ├── users.ts       # GET /leads (Sales), GET / (Admin)
│   │   ├── loans.ts       # Full loan lifecycle routes
│   │   ├── payments.ts    # Record payment + auto-close
│   │   └── uploads.ts     # Multer file upload
│   ├── middleware/
│   │   └── auth.ts        # JWT authenticate + RBAC authorize
│   └── lib/
│       └── bre.ts         # Business Rule Engine + SI formula
├── uploads/               # Uploaded salary slips stored here
├── .env.example
├── package.json
└── tsconfig.json
```

---

## API Reference

All protected routes require:  
`Authorization: Bearer <token>`

### Auth
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | No | Register new borrower |
| POST | `/api/auth/login` | No | Login, returns JWT |
| GET | `/api/auth/me` | Yes | Get current user |

### Loans — Borrower
| Method | Route | Roles | Description |
|--------|-------|-------|-------------|
| POST | `/api/loans/apply` | borrower | Submit loan application (BRE runs server-side) |
| GET | `/api/loans/my` | borrower | My loans with payment summary |
| GET | `/api/loans/:id` | borrower/ops | Single loan detail |

### Loans — Operations
| Method | Route | Roles | Description |
|--------|-------|-------|-------------|
| GET | `/api/loans/ops/sanction` | sanction, admin | Pending applications |
| PATCH | `/api/loans/:id/sanction` | sanction, admin | Approve/reject with reason |
| GET | `/api/loans/ops/disbursement` | disbursement, admin | Sanctioned loans ready |
| PATCH | `/api/loans/:id/disburse` | disbursement, admin | Mark as disbursed |
| GET | `/api/loans/ops/collection` | collection, admin | Active + closed loans |
| GET | `/api/loans` | admin | All loans with KPIs |

### Users
| Method | Route | Roles | Description |
|--------|-------|-------|-------------|
| GET | `/api/users/leads` | sales, admin | Borrowers who haven't applied |
| GET | `/api/users` | admin | All users |

### Payments
| Method | Route | Roles | Description |
|--------|-------|-------|-------------|
| POST | `/api/payments` | collection, admin | Record payment (UTR unique, auto-close) |
| GET | `/api/payments/loan/:loanId` | all authed | Payments for a loan |

### Upload
| Method | Route | Roles | Description |
|--------|-------|-------|-------------|
| POST | `/api/upload/salary-slip` | borrower | Upload PDF/JPG/PNG ≤ 5MB |

---

## Business Rules (BRE)

All checked server-side on `/api/loans/apply`:

| Rule | Rejection Condition |
|------|---------------------|
| Age | Not between 23–50 |
| Salary | Below ₹25,000/month |
| PAN | Doesn't match `^[A-Z]{5}[0-9]{4}[A-Z]{1}$` |
| Employment | Unemployed |

## Loan Status Transitions

```
pending → sanctioned (sanction exec: approve)
pending → rejected   (sanction exec: reject + reason)
sanctioned → disbursed (disbursement exec)
disbursed → closed   (auto, when totalPaid >= totalRepayment)
```

## Interest Formula

```
SI = (P × R × T) / (365 × 100)
where R = 12 (fixed), T = tenure in days

Total Repayment = P + SI
```
