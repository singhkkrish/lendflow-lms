import { BREInput, BREResult } from '@/types';

// ── Loan calculator ───────────────────────────────────────────────────────────
export const calcSI = (principal: number, tenureDays: number): number =>
  Math.round((principal * 12 * tenureDays) / (365 * 100));

export const calcTotal = (principal: number, tenureDays: number): number =>
  principal + calcSI(principal, tenureDays);

export const calcMonthly = (principal: number, tenureDays: number): number =>
  Math.round(calcTotal(principal, tenureDays) / (tenureDays / 30));

export const fmtINR = (n: number): string =>
  '₹' + Number(n).toLocaleString('en-IN');

// ── BRE ──────────────────────────────────────────────────────────────────────
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

export function runBRE(input: BREInput): BREResult {
  const errors: string[] = [];

  if (input.dob) {
    const age = Math.floor(
      (new Date().getTime() - new Date(input.dob).getTime()) /
      (365.25 * 24 * 3600 * 1000)
    );
    if (age < 23 || age > 50)
      errors.push(`Age ${age} is not between 23 and 50 years`);
  }

  if (input.salary && Number(input.salary) < 25000)
    errors.push('Monthly salary must be ₹25,000 or above');

  if (input.pan && !PAN_REGEX.test(input.pan.toUpperCase()))
    errors.push('PAN format invalid — must be like ABCDE1234F');

  if (input.employment === 'Unemployed')
    errors.push('Unemployed applicants are not eligible');

  return { eligible: errors.length === 0, errors };
}

export function calcAge(dob: string): number {
  return Math.floor(
    (new Date().getTime() - new Date(dob).getTime()) /
    (365.25 * 24 * 3600 * 1000)
  );
}

export function validatePAN(pan: string): boolean {
  return PAN_REGEX.test(pan.toUpperCase());
}

export function genAppId(): string {
  return (
    'LF-' +
    Math.random().toString(36).slice(2, 6).toUpperCase() +
    Math.random().toString(36).slice(2, 6).toUpperCase()
  );
}
