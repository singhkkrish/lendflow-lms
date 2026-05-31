# 🏦 LendFlow — Loan Management System

> A full-stack Loan Management System built with **Next.js · Node.js · Express · MongoDB · TypeScript**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20-green?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7-green?logo=mongodb)](https://mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Seed the Database](#seed-the-database)
- [Demo Credentials](#demo-credentials)
- [API Reference](#api-reference)
- [Loan Formula](#loan-formula)
- [BRE Rules](#bre-rules)
- [Loan Status Flow](#loan-status-flow)
- [RBAC — Role Based Access](#rbac--role-based-access)
- [Features](#features)

---

## Overview

LendFlow is a lending platform where:

- **Borrowers** register, fill personal details, upload a salary slip, configure a loan and submit an application
- **Operations teams** (Sales, Sanction, Disbursement, Collection) each manage their stage of the loan lifecycle through a role-gated internal dashboard
- **Admins** have full visibility across all modules

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (Pages Router), TypeScript, Tailwind CSS |
| Backend | Node.js, Express.js, TypeScript |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcrypt |
| File Upload | Multer (PDF / JPG / PNG ≤ 5 MB) |
| State | Zustand |

---

## Project Structure

```
LMS/
│
├── backend/                              # Express + MongoDB API
│   ├── src/
│   │   ├── lib/
│   │   │   └── bre.ts                   # BRE engine + SI calculator
│   │   ├── middleware/
│   │   │   └── auth.ts                  # JWT authenticate + RBAC authorize
│   │   ├── models/
│   │   │   ├── Loan.ts                  # Loan lifecycle model
│   │   │   ├── Payment.ts               # Payment model (UTR unique)
│   │   │   └── User.ts                  # User model + bcrypt password hash
│   │   ├── routes/
│   │   │   ├── auth.ts                  # POST /register, POST /login, GET /me
│   │   │   ├── loans.ts                 # Full loan CRUD + lifecycle routes
│   │   │   ├── payments.ts              # Record payment + auto-close logic
│   │   │   ├── uploads.ts               # Multer salary slip upload
│   │   │   └── users.ts                 # GET /leads, GET /users
│   │   ├── seed.ts                      # Seed script — all role accounts + sample data
│   │   └── server.ts                    # Express app entry + MongoDB connection
│   ├── uploads/                         # Uploaded salary slips stored here
│   ├── .env                             # Your environment variables (git-ignored)
│   ├── .env.example                     # Environment variable template
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   └── tsconfig.json
│
└── lendflow/                            # Next.js Frontend
    ├── src/
    │   ├── components/
    │   │   ├── shared/                  # Shared UI components
    │   │   ├── borrower/                # Borrower-specific components
    │   │   └── ops/                     # Operations dashboard components
    │   ├── hooks/
    │   │   └── useApi.ts                # Custom API hook (axios wrapper)
    │   ├── lib/
    │   │   ├── api.ts                   # Axios API client
    │   │   ├── calc.ts                  # SI formula + BRE engine (client-side)
    │   │   └── withAuth.tsx             # Auth HOC — route protection
    │   ├── pages/
    │   │   ├── loan/
    │   │   │   └── [id].jsx             # Dynamic loan detail page
    │   │   ├── _app.tsx                 # Next.js app wrapper + global styles
    │   │   ├── apply.jsx                # 4-step borrower application wizard
    │   │   ├── complete-demo.jsx        # Full app demo in one file
    │   │   ├── dashboard.jsx            # Borrower dashboard
    │   │   ├── index.tsx                # Root redirect → login or dashboard
    │   │   ├── loan-detail.jsx          # Loan detail (profile, audit log, payments)
    │   │   ├── login.jsx                # Login page
    │   │   ├── ops.jsx                  # Operations dashboard (all 5 modules)
    │   │   └── register.jsx             # Register page
    │   ├── store/
    │   │   └── authStore.ts             # Zustand auth store + dark mode
    │   ├── styles/
    │   │   └── globals.css              # Tailwind base + Google Fonts + animations
    │   └── types/
    │       ├── globals.d.ts             # Global type declarations
    │       └── index.ts                 # All TypeScript interfaces (User, Loan, Payment...)
    ├── .env.example                     # Frontend env template
    ├── .env.local                       # Your frontend env (git-ignored)
    ├── next-env.d.ts
    ├── next.config.js
    ├── package.json
    ├── package-lock.json
    ├── postcss.config.js
    ├── tailwind.config.js
    └── tsconfig.json
```

---

## Getting Started

### Prerequisites

- Node.js v20+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- npm

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/lendflow.git
cd LMS
```

---

### 2. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` with your MongoDB URI, then:

```bash
# Seed database — creates all role accounts + sample loans
npm run seed

# Start dev server
npm run dev
```

Backend runs at: **http://localhost:5000**

---

### 3. Setup Frontend

```bash
cd ../lendflow
npm install
cp .env.example .env.local
```

Edit `.env.local`, then:

```bash
npm run dev
```

Frontend runs at: **http://localhost:3000**

---

## Environment Variables

### Backend — `backend/.env`

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lendflow
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

### Frontend — `lendflow/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## Seed the Database

Run **once** after configuring your `.env`:

```bash
cd backend
npm run seed
```

Creates:
- ✅ One account per role with known credentials
- ✅ Sample loans at every stage (Pending, Sanctioned, Active, Closed)
- ✅ Sample payments for Active / Closed loans

---

## Demo Credentials

> All passwords: **`password123`**

| Role | Email | Access |
|---|---|---|
| Borrower | borrower@lendflow.io | Apply portal + Borrower dashboard |
| Admin | admin@lendflow.io | All 5 ops modules |
| Sales | sales@lendflow.io | Sales module only |
| Sanction | sanction@lendflow.io | Sanction module only |
| Disbursement | disbursement@lendflow.io | Disbursement module only |
| Collection | collection@lendflow.io | Collection module only |

---

## API Reference

All protected routes require:
```
Authorization: Bearer <token>
```

### Auth

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login — returns JWT token |
| GET | `/api/auth/me` | Yes | Get current logged-in user |

### Loans — Borrower

| Method | Route | Role | Description |
|---|---|---|---|
| POST | `/api/loans/apply` | borrower | Submit application (BRE runs server-side) |
| GET | `/api/loans/my` | borrower | My loans with payment summary |
| GET | `/api/loans/:id` | borrower, ops | Single loan detail |

### Loans — Operations

| Method | Route | Role | Description |
|---|---|---|---|
| GET | `/api/loans/ops/sanction` | sanction, admin | All pending applications |
| PATCH | `/api/loans/:id/sanction` | sanction, admin | Approve or reject with reason |
| GET | `/api/loans/ops/disbursement` | disbursement, admin | Sanctioned loans ready to disburse |
| PATCH | `/api/loans/:id/disburse` | disbursement, admin | Mark loan as disbursed |
| GET | `/api/loans/ops/collection` | collection, admin | Active + closed loans |
| GET | `/api/loans` | admin | All loans + KPI totals |

### Users

| Method | Route | Role | Description |
|---|---|---|---|
| GET | `/api/users/leads` | sales, admin | Borrowers who registered but haven't applied |
| GET | `/api/users` | admin | All users |

### Payments

| Method | Route | Role | Description |
|---|---|---|---|
| POST | `/api/payments` | collection, admin | Record payment (UTR unique, auto-close on full repayment) |
| GET | `/api/payments/loan/:loanId` | all authenticated | All payments for a loan |

### Upload

| Method | Route | Role | Description |
|---|---|---|---|
| POST | `/api/upload/salary-slip` | borrower | Upload salary slip — PDF/JPG/PNG ≤ 5 MB |

---

## Loan Formula

**Simple Interest:**

```
SI = (P × R × T) / (365 × 100)

Where:
  P = Principal (loan amount in ₹)
  R = 12  (fixed annual interest rate %)
  T = Tenure in days

Total Repayment = P + SI
```

**Example:**
```
P = ₹2,50,000  |  T = 180 days  |  R = 12%
SI    = (250000 × 12 × 180) / (365 × 100) = ₹14,795
Total = ₹2,64,795
```

---

## BRE Rules

Validated **server-side** on every `/api/loans/apply` call.
Frontend also runs a preview check for instant UX feedback.

| Rule | Rejection Condition |
|---|---|
| Age | Not between **23 and 50** years |
| Salary | Below **₹25,000 / month** |
| PAN | Does not match `^[A-Z]{5}[0-9]{4}[A-Z]$` |
| Employment | Applicant is **Unemployed** |

If **any** rule fails → application is blocked with a clear error message.

---

## Loan Status Flow

```
Borrower submits
      │
      ▼
  [pending]
      │
   ┌──┴────────────────┐
   │                   │
   ▼                   ▼
[sanctioned]       [rejected] ← Sanction executive (must provide reason)
   │
   ▼
[disbursed / active] ← Disbursement executive confirms
   │
   ▼
 [closed] ← Auto when totalPaid >= totalRepayment
```

| Transition | Triggered By | Endpoint |
|---|---|---|
| pending → sanctioned | Sanction exec | `PATCH /loans/:id/sanction` `{ action: "approve" }` |
| pending → rejected | Sanction exec | `PATCH /loans/:id/sanction` `{ action: "reject", reason: "..." }` |
| sanctioned → disbursed | Disbursement exec | `PATCH /loans/:id/disburse` |
| disbursed → closed | Auto on payment | `POST /payments` (triggers when fully paid) |

---

## RBAC — Role Based Access

Enforced on **both frontend routes and every backend API endpoint**.

| Role | Frontend Pages | API Routes Allowed |
|---|---|---|
| Borrower | `/apply` `/dashboard` `/loan/[id]` | `/loans/apply` `/loans/my` `/upload` |
| Admin | All ops modules | All routes |
| Sales | Ops → Sales tab only | `/users/leads` |
| Sanction | Ops → Sanction tab only | `/loans/ops/sanction` `/loans/:id/sanction` |
| Disbursement | Ops → Disbursement tab only | `/loans/ops/disbursement` `/loans/:id/disburse` |
| Collection | Ops → Collection tab only | `/loans/ops/collection` `/payments` |

- Unauthorized → **`403 Forbidden`**
- Unauthenticated → **`401 Unauthorized`**

---

## Features

### Borrower Portal
- ✅ Register / Login with JWT auth and bcrypt hashed passwords
- ✅ Route protection via `withAuth.tsx` HOC
- ✅ 4-step application wizard with animated progress tracker
- ✅ Live BRE eligibility check — client preview + server enforcement
- ✅ Drag & drop salary slip upload (PDF/JPG/PNG, max 5 MB)
- ✅ Interactive loan amount + tenure sliders with live SI calculation
- ✅ Review & submit with confirmation checkbox
- ✅ Success screen with generated Application ID
- ✅ Borrower dashboard — loan cards, status filter tabs, repayment progress bars
- ✅ Dynamic loan detail page `/loan/[id]` with payment history + status timeline

### Operations Dashboard
- ✅ Collapsible sidebar — only allowed modules visible per role
- ✅ Admin overview — KPI cards + recent applications table
- ✅ **Sales** — searchable, paginated leads table (registered but not applied)
- ✅ **Sanction** — review applications, approve or reject with reason modal
- ✅ **Disbursement** — confirm fund release with confirmation dialog
- ✅ **Collection** — record payments (UTR + amount + date), repayment progress, auto-close on full repayment
- ✅ Loan detail — customer profile, audit log, repayment breakdown chart, full payment history table

### System
- ✅ Dark / Light mode across all pages
- ✅ Fully responsive — mobile, tablet, desktop
- ✅ Empty states, error states, loading skeletons
- ✅ RBAC enforced on both frontend (`withAuth.tsx`) and backend middleware (`auth.ts`)
- ✅ Seed script — 6 roles + sample data at every loan stage

---

## Video Demo

Screen recording (3–5 min) covering the complete flow:

1. Borrower registers → BRE fail (unemployed / low salary) → BRE pass → submits
2. Sanction executive logs in → approves application
3. Disbursement executive logs in → releases funds
4. Collection executive logs in → records payments

## Demo Video

🎥 [Project Demonstration Video](https://drive.google.com/file/d/1sl511nBGzG6fAbEDMz6FGwPtbc_ovh_l/view?usp=sharing)

---

## Live Demo

🌐 [LendFlow LMS](https://lendflow-frontend.onrender.com)

---

## Author

Built for the **LMS Full-Stack Assignment** — MERN · Next.js · TypeScript

---

> ⚠️ For evaluation purposes only.
