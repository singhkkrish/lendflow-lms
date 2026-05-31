import mongoose, { Document, Schema } from 'mongoose';

export type LoanStatus =
  | 'pending'
  | 'sanctioned'
  | 'rejected'
  | 'disbursed'
  | 'closed';

export interface ILoan extends Document {
  _id: mongoose.Types.ObjectId;
  applicationId: string;

  // Borrower reference
  borrower: mongoose.Types.ObjectId;

  // Personal details (captured at application time)
  fullName: string;
  pan: string;
  dateOfBirth: Date;
  monthlySalary: number;
  employmentMode: 'salaried' | 'self-employed';

  // Document
  salarySlipUrl?: string;

  // Loan configuration
  amount: number;        // Principal in ₹
  tenure: number;        // In days
  interestRate: number;  // Always 12 (p.a.)
  interest: number;      // SI computed
  totalRepayment: number;

  // Lifecycle
  status: LoanStatus;
  rejectionReason?: string;

  // Timestamps for each stage
  appliedAt: Date;
  sanctionedAt?: Date;
  disbursedAt?: Date;
  closedAt?: Date;

  // Ops actors
  sanctionedBy?: mongoose.Types.ObjectId;
  disbursedBy?: mongoose.Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const LoanSchema = new Schema<ILoan>(
  {
    applicationId: {
  type: String,
  unique: true,
  default: () =>
    `LF-${Date.now().toString(36).toUpperCase()}-${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`
},

    borrower: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    fullName:        { type: String, required: true },
    pan:             { type: String, required: true },
    dateOfBirth:     { type: Date,   required: true },
    monthlySalary:   { type: Number, required: true },
    employmentMode:  { type: String, enum: ['salaried', 'self-employed'], required: true },

    salarySlipUrl:   { type: String },

    amount:          { type: Number, required: true, min: 50000, max: 500000 },
    tenure:          { type: Number, required: true, min: 30, max: 365 },
    interestRate:    { type: Number, default: 12 },
    interest:        { type: Number, required: true },
    totalRepayment:  { type: Number, required: true },

    status:          { type: String, enum: ['pending','sanctioned','rejected','disbursed','closed'], default: 'pending' },
    rejectionReason: { type: String },

    appliedAt:   { type: Date, default: Date.now },
    sanctionedAt:{ type: Date },
    disbursedAt: { type: Date },
    closedAt:    { type: Date },

    sanctionedBy:{ type: Schema.Types.ObjectId, ref: 'User' },
    disbursedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

// Auto-generate applicationId before first save


export default mongoose.model<ILoan>('Loan', LoanSchema);
