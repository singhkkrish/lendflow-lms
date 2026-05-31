# 🏦 LendFlow — Loan Management System Frontend

Production-grade LMS frontend built with React (Next.js-ready), TypeScript-compatible, fully self-contained JSX files.

---

## 📦 Files in this ZIP

| File | Description |
|------|-------------|
| `src/pages/login.jsx` | Login + Register pages (split-screen, role switcher, demo creds) |
| `src/pages/apply.jsx` | 4-step borrower wizard (Personal + BRE, Upload, Sliders, Review) |
| `src/pages/dashboard.jsx` | Borrower dashboard (loan cards, tabs, repayment, drawer) |
| `src/pages/ops.jsx` | Ops dashboard (sidebar + Sales/Sanction/Disbursement/Collection) |
| `src/pages/loan-detail.jsx` | Full loan detail (profile, timeline, chart, payments, audit log) |
| `src/pages/complete-demo.jsx` | ⭐ ALL pages in one navigable file |
| `src/lib/calc.ts` | SI calculator + BRE engine (TypeScript) |
| `src/lib/constants.ts` | Mock data, roles, config |
| `src/types/index.ts` | All TypeScript types |
| `src/store/authStore.ts` | Zustand auth store |
| `src/styles/globals.css` | Global CSS + animations |

---

## 🚀 Quickest Way to Run

### Option A — React (Vite / CRA)
```bash
npx create-react-app lendflow
cd lendflow
# Replace src/App.js with contents of complete-demo.jsx
npm start
```

### Option B — Next.js
```bash
npx create-next-app@latest lendflow --js --no-tailwind --no-eslint
cd lendflow
npm install
# Copy pages/*.jsx into pages/
npm run dev
```

### Option C — Paste into Claude Artifact
Open Claude → New chat → Create Artifact → Paste `complete-demo.jsx`

---

## 🔐 Demo Credentials (all passwords: `password123`)

| Role | Email |
|------|-------|
| Borrower | borrower@lendflow.io |
| Admin | admin@lendflow.io |
| Sales | sales@lendflow.io |
| Sanction | sanction@lendflow.io |
| Disbursement | disbursement@lendflow.io |
| Collection | collection@lendflow.io |

---

## 🧮 Loan Formula

```
SI = (P × 12 × T) / (365 × 100)   where T = tenure in days
Total Repayment = P + SI
```

---

## ✅ BRE Rules

| Rule | Condition |
|------|-----------|
| Age | 23 – 50 years |
| Salary | ≥ ₹25,000/month |
| PAN | Format: `ABCDE1234F` |
| Employment | Cannot be Unemployed |

---

## 🔄 Loan Status Flow

```
[Register] → [Apply] → Pending → Sanctioned → Active → Closed
                               ↘ Rejected
```

---

## 🎨 Design Tokens

| Token | Value |
|-------|-------|
| Primary | `#6366f1` (Indigo) |
| Success | `#10b981` (Emerald) |
| Warning | `#f59e0b` (Amber) |
| Danger | `#ef4444` (Red) |
| Violet | `#8b5cf6` |
| Font | DM Sans (Google Fonts) |

---

## 🏗 RBAC — Who sees what

| Role | Access |
|------|--------|
| Borrower | Apply flow + Borrower dashboard only |
| Admin | All 5 ops modules |
| Sales | Sales module only |
| Sanction | Sanction module only |
| Disbursement | Disbursement module only |
| Collection | Collection module only |

---

Built with React · No external UI library required · Dark mode included
