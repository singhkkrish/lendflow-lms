// Business Rule Engine — runs on the server (source of truth)
// Same rules as frontend but backend is authoritative.

export interface BREInput {
  dateOfBirth: string | Date;
  monthlySalary: number;
  pan: string;
  employmentMode: string;
}

export interface BREResult {
  passed: boolean;
  errors: string[];
}

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

function getAge(dob: string | Date): number {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export function runBRE(input: BREInput): BREResult {
  const errors: string[] = [];

  // Rule 1: Age must be between 23 and 50
  const age = getAge(input.dateOfBirth);
  if (age < 23 || age > 50) {
    errors.push(`Age must be between 23 and 50 (yours: ${age})`);
  }

  // Rule 2: Monthly salary >= ₹25,000
  if (input.monthlySalary < 25000) {
    errors.push(`Monthly salary must be at least ₹25,000 (yours: ₹${input.monthlySalary.toLocaleString('en-IN')})`);
  }

  // Rule 3: Valid PAN format
  if (!PAN_REGEX.test(input.pan.toUpperCase())) {
    errors.push(`PAN must be in format ABCDE1234F (e.g. ABCDE1234F)`);
  }

  // Rule 4: Not unemployed
  if (input.employmentMode === 'unemployed') {
    errors.push('Unemployed applicants are not eligible for a loan');
  }

  return { passed: errors.length === 0, errors };
}

// ── Simple Interest ─────────────────────────────────────────────────────────
// SI = (P × R × T) / (365 × 100)   where T = tenure in days, R = 12
export function calculateSI(principal: number, tenure: number, rate = 12): {
  interest: number;
  totalRepayment: number;
} {
  const interest = Math.round((principal * rate * tenure) / (365 * 100));
  return { interest, totalRepayment: principal + interest };
}
