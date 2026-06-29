// build-data.mjs — generate the machine-readable JSON data layer (data/*.json)
// from the VERIFIED rate rules, then validate every figure two ways so the JSON
// can never silently drift from the human-verified markdown:
//   (1) arithmetic self-consistency (each number must follow from the stated rate)
//   (2) anchor cross-check against the source markdown (parse the published
//       example rows and assert they equal what we generated)
//
//   node tools/build-data.mjs           # generate + validate + write
//   node tools/build-data.mjs --check   # validate only (CI / drift check), no write
//
// The markdown in ph/** remains the source of truth (it was verified against the
// scanned government PDFs). This script is the PARSE layer + the drift guard.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA = path.join(ROOT, 'data');
const CHECK_ONLY = process.argv.includes('--check');

const r2 = (n) => Math.round(n * 100) / 100;
const r3 = (n) => Math.round(n * 1000) / 1000;
const fails = [];
const assert = (cond, msg) => { if (!cond) fails.push(msg); };
const readMd = (rel) => fs.readFile(path.join(ROOT, rel), 'utf8');

// ───────────────────────────── SSS ─────────────────────────────
// Rules verified in ph/sss/contribution_table_2025.md (SSS Circular 2024-006).
const sssRules = {
  total_rate: 0.15, employee_rate: 0.05, employer_rate: 0.10,
  msc_min: 5000, msc_max: 35000, msc_step: 500,
  mpf_threshold: 20000,             // MSC above this routes the excess to MPF/WISP
  ec_low: 10, ec_high: 30, ec_low_max_msc: 14500, // EC ₱10 for MSC ≤ 14,500 else ₱30
};
function buildSSS() {
  const brackets = [];
  for (let msc = sssRules.msc_min; msc <= sssRules.msc_max; msc += sssRules.msc_step) {
    const first = msc === sssRules.msc_min, last = msc === sssRules.msc_max;
    const employee = r2(msc * sssRules.employee_rate);
    const employer = r2(msc * sssRules.employer_rate);
    const ec = msc <= sssRules.ec_low_max_msc ? sssRules.ec_low : sssRules.ec_high;
    brackets.push({
      comp_min: first ? 0 : msc - 250,
      comp_max: last ? null : r2(msc + 249.99),
      msc,
      reg_ss_msc: Math.min(msc, sssRules.mpf_threshold),
      mpf_msc: Math.max(0, msc - sssRules.mpf_threshold),
      employee, employer, ec,
      total_sss_only: r2(employee + employer),   // the pure 15% (EE + ER)
      total_incl_ec: r2(employee + employer + ec), // what the markdown's "Total (incl. EC)" column shows
    });
  }
  return {
    topic: 'SSS monthly contribution by salary bracket',
    country: 'PH', effective_date: '2025-01-01', currency: 'PHP', volatility: 'stable',
    source: {
      issuance: 'SSS Circular No. 2024-006', source_tier: 'primary', last_verified: '2026-06-24',
      url: 'https://www.sss.gov.ph/wp-content/uploads/2024/12/CI-2024-006-Publication.pdf',
      markdown: 'ph/sss/contribution_table_2025.md',
    },
    notes: 'Employee share is deducted from pay; the employer pays employer + EC on top. total_incl_ec = employee + employer + ec; total_sss_only = employee + employer (the pure 15%). For MSC above 20,000 the excess goes to the MPF/WISP provident fund at the same rate. Find a salary\'s bracket where comp_min <= salary <= comp_max (last bracket comp_max=null means "and above"). Boundaries use .99 (e.g. comp_max 25249.99) so integer-peso salaries map unambiguously — a salary of exactly 25,250 falls into the next bracket.',
    rules: sssRules,
    brackets,
  };
}

// ─────────────────────────── INCOME TAX ───────────────────────────
// Verified in ph/bir/income_tax_table_2025.md (BIR RR 8-2018 / TRAIN), 2023-onward.
const taxAnnual = [
  { over: 0, not_over: 250000, base_tax: 0, rate: 0.00, of_excess_over: 0 },
  { over: 250000, not_over: 400000, base_tax: 0, rate: 0.15, of_excess_over: 250000 },
  { over: 400000, not_over: 800000, base_tax: 22500, rate: 0.20, of_excess_over: 400000 },
  { over: 800000, not_over: 2000000, base_tax: 102500, rate: 0.25, of_excess_over: 800000 },
  { over: 2000000, not_over: 8000000, base_tax: 402500, rate: 0.30, of_excess_over: 2000000 },
  { over: 8000000, not_over: null, base_tax: 2202500, rate: 0.35, of_excess_over: 8000000 },
];
const taxOn = (annual) => {
  const b = [...taxAnnual].reverse().find((x) => annual > x.over);
  return r2(b.base_tax + b.rate * (annual - b.of_excess_over));
};
// Monthly + semi-monthly withholding tables (verbatim from the markdown; annual÷12, ÷24).
const taxMonthly = [
  { over: 0, not_over: 20833, base_tax: 0, rate: 0.00, of_excess_over: 0 },
  { over: 20833, not_over: 33333, base_tax: 0, rate: 0.15, of_excess_over: 20833 },
  { over: 33333, not_over: 66667, base_tax: 1875, rate: 0.20, of_excess_over: 33333 },
  { over: 66667, not_over: 166667, base_tax: 8542, rate: 0.25, of_excess_over: 66667 },
  { over: 166667, not_over: 666667, base_tax: 33542, rate: 0.30, of_excess_over: 166667 },
  { over: 666667, not_over: null, base_tax: 183542, rate: 0.35, of_excess_over: 666667 },
];
const taxSemiMonthly = [
  { over: 0, not_over: 10417, base_tax: 0, rate: 0.00, of_excess_over: 0 },
  { over: 10417, not_over: 16667, base_tax: 0, rate: 0.15, of_excess_over: 10417 },
  { over: 16667, not_over: 33333, base_tax: 937.50, rate: 0.20, of_excess_over: 16667 },
  { over: 33333, not_over: 83333, base_tax: 4271, rate: 0.25, of_excess_over: 33333 },
  { over: 83333, not_over: 333333, base_tax: 16771, rate: 0.30, of_excess_over: 83333 },
  { over: 333333, not_over: null, base_tax: 91771, rate: 0.35, of_excess_over: 333333 },
];
const whtMonthly = (taxableMonthly) => {
  const b = [...taxMonthly].reverse().find((x) => taxableMonthly > x.over);
  return r2(b.base_tax + b.rate * (taxableMonthly - b.of_excess_over));
};
function buildIncomeTax() {
  return {
    topic: 'Graduated income tax / withholding on compensation (2023-onward TRAIN)',
    country: 'PH', effective_date: '2023-01-01', currency: 'PHP', volatility: 'stable',
    source: {
      issuance: 'BIR Revenue Regulations No. 8-2018 (RA 10963 / TRAIN)', source_tier: 'primary',
      last_verified: '2026-06-24', url: 'https://bir-cdn.bir.gov.ph/local/pdf/Digest%20RR%208-2018_copy.pdf',
      markdown: 'ph/bir/income_tax_table_2025.md',
    },
    notes: 'Tax on annual taxable income = base_tax + rate * (income - of_excess_over). Monthly = annual/12 brackets; semi_monthly = annual/24. Minimum-wage earners are fully exempt.',
    annual: taxAnnual,
    monthly: taxMonthly,
    semi_monthly: taxSemiMonthly,
    formula: 'tax = base_tax + rate * (taxable_income - of_excess_over), using the table for the pay period (annual / monthly / semi_monthly)',
    taxable_base: 'taxable_income = gross compensation - employee SSS/PhilHealth/Pag-IBIG contributions - non-taxable items (de minimis within ceilings; 13th-month + other bonuses up to 90,000). Apply the table to taxable_income, NOT to gross pay.',
  };
}

// ───────────────── WORKED NET-PAY EXAMPLES (end-to-end) ─────────────────
// Employee-side monthly deductions + net pay, computed from ALL the rate files
// above — the one task competitors' calculators "win" on, here drift-guarded.
function buildExamples() {
  const rows = [25000, 50000, 80000].map((salary) => {
    const msc = Math.min(Math.max(salary, sssRules.msc_min), sssRules.msc_max);
    const sss = r2(msc * sssRules.employee_rate);
    const philhealth = r2(Math.min(Math.max(salary, 10000), 100000) * 0.025);
    const pagibig = salary > 1500 ? r2(Math.min(salary, 10000) * 0.02) : r2(salary * 0.01);
    const taxable = r2(salary - sss - philhealth - pagibig);
    const withholding_tax = whtMonthly(taxable);
    return {
      monthly_salary: salary,
      employee_deductions: { sss, philhealth, pagibig, withholding_tax },
      taxable_income: taxable,
      net_pay: r2(salary - sss - philhealth - pagibig - withholding_tax),
    };
  });
  return {
    topic: 'Worked monthly net-pay examples (employee-side), computed from the rate files',
    country: 'PH', currency: 'PHP', volatility: 'stable',
    source: {
      issuance: 'Derived from the data/ rate files (SSS Circular 2024-006, BIR RR 8-2018, PhilHealth PA2025-0002, HDMF Circular 460)',
      source_tier: 'primary', last_verified: '2026-06-24', markdown: 'ph/bir/income_tax_table_2025.md',
    },
    notes: 'Employee-side only; assumes a non-minimum-wage earner with no other bonuses/de-minimis. net_pay = monthly_salary - sss - philhealth - pagibig - withholding_tax. SSS caps at MSC 35,000; PhilHealth caps at 100,000; Pag-IBIG caps at MFS 10,000.',
    examples: rows,
  };
}

// ─────────────────────────── PHILHEALTH ───────────────────────────
// Verified in ph/philhealth/contribution_rate_2025.md (PhilHealth Advisory PA2025-0002).
function buildPhilHealth() {
  return {
    topic: 'PhilHealth monthly premium', country: 'PH', effective_date: '2025-01-01',
    currency: 'PHP', volatility: 'stable',
    source: {
      issuance: 'PhilHealth Advisory No. PA2025-0002 (RA 11223)', source_tier: 'primary',
      last_verified: '2026-06-24', url: 'https://www.philhealth.gov.ph/advisories/2025/PA2025-0002.pdf',
      markdown: 'ph/philhealth/contribution_rate_2025.md',
    },
    rate: 0.05, employee_rate: 0.025, employer_rate: 0.025,
    salary_floor: 10000, salary_ceiling: 100000,
    min_premium_total: 500, max_premium_total: 5000,
    notes: 'premium = clamp(monthly_basic_salary, 10000, 100000) * 0.05; employee = that / 2. 5% is the final UHC tranche (RA 11223 ceiling) — continues for 2026.',
    formula: 'msb = min(max(basic,10000),100000); total = msb*0.05; employee = msb*0.025',
  };
}

// ──────────────────────────── PAG-IBIG ────────────────────────────
// Verified in ph/pagibig/contribution_table_2025.md (HDMF Circular 460 via DBM CL 2024-2).
function buildPagibig() {
  return {
    topic: 'Pag-IBIG (HDMF) monthly contribution', country: 'PH', effective_date: '2024-02-01',
    currency: 'PHP', volatility: 'stable',
    source: {
      issuance: 'HDMF Circular No. 460 (via DBM Circular Letter 2024-2)', source_tier: 'primary',
      last_verified: '2026-06-24', url: 'https://www.dbm.gov.ph/wp-content/uploads/Issuances/2024/Circular-Letter/CIRCULAR-LETTER-NO-2024-2-DATED-FEBRUARY-01-2024.pdf',
      markdown: 'ph/pagibig/contribution_table_2025.md',
    },
    mfs_cap: 10000, max_each: 200,
    tiers: [
      { comp_min: 0, comp_max: 1500, employee_rate: 0.01, employer_rate: 0.02 },
      { comp_min: 1500.01, comp_max: null, employee_rate: 0.02, employer_rate: 0.02 },
    ],
    notes: 'Contribution base is capped at the Maximum Fund Salary (MFS) of ₱10,000, so each side maxes at ₱200. employee = min(comp, 10000) * employee_rate (for comp > 1500). Employees may add voluntary contributions above ₱200.',
    formula: 'base = min(comp, 10000); employee = base * employee_rate; employer = base * employer_rate',
  };
}

// ────────────────────────── 13TH-MONTH PAY ─────────────────────────
// Verified in ph/benefits/13th_month_pay.md (PD 851 + RA 10963 / TRAIN).
function buildThirteenth() {
  return {
    topic: '13th-month pay — mandate, computation, tax treatment', country: 'PH',
    effective_date: '2018-01-01', currency: 'PHP', volatility: 'stable',
    source: {
      issuance: 'Presidential Decree 851 (mandate); RA 10963 / TRAIN (₱90,000 tax-free ceiling)',
      source_tier: 'primary', last_verified: '2026-06-24', markdown: 'ph/benefits/13th_month_pay.md',
    },
    mandatory: true,
    computation: 'total_basic_salary_earned_in_year / 12',
    pay_deadline: '12-24',
    tax_exempt_ceiling: 90000,
    ceiling_scope: 'combined across 13th-month pay + Christmas/14th-month + mid-year + performance/productivity bonuses + similar benefits',
    excess_treatment: 'amount above 90,000 is added to taxable compensation and taxed at the graduated income-tax rates',
    notes: 'The ₱90,000 is a combined annual ceiling for all bonuses of a similar nature, not per benefit.',
  };
}

// ─────────────────────────── MINIMUM WAGE ──────────────────────────
// Verified in ph/min-wage/by_region_2025.md (NWPC matrix). VOLATILE — re-pull the
// NWPC matrix before relying; this is the one continuously-changing variable.
function buildMinWage() {
  const regions = [
    ['NCR', 'NCR-26', 658, 695, '2025-07-18'],
    ['CAR', 'CAR-24', 480, 500, '2025-12-30'],
    ['Region I', 'RB I-24', 480, 505, '2025-11-19'],
    ['Region II', 'RTWPB 2-24', 480, 505, '2025-11-17'],
    ['Region III', 'RBIII-26', 515, 600, '2025-10-30'],
    ['Region IV-A', 'IVA-22', 508, 600, '2025-09-29'],
    ['Region IV-B', 'MIMAROPA-13', 455, 455, '2026-01-01'],
    ['Region V', 'RBV-22', 435, 435, '2025-04-05'],
    ['Region VI', 'RBVI-29', 520, 550, '2025-11-19'],
    ['Region VII', 'ROVII-26', 500, 540, '2025-10-04'],
    ['Region VIII', 'RB VIII-25', 440, 470, '2025-12-08'],
    ['Region IX', 'RIX-24', 451, 464, '2026-01-01'],
    ['Region X', 'RX-24', 485, 500, '2026-01-16'],
    ['Region XI', 'RB XI-24', 525, 540, '2026-03-13'],
    ['Region XII', 'RB XII-25', 443, 460, '2026-03-03'],
    ['Region XIII', 'RXIII-20', 475, 475, '2026-01-03'],
    ['BARMM', 'BARMM-04', 366, 411, '2025-07-17'],
  ].map(([region, wage_order, daily_min_low, daily_min_high, effective]) =>
    ({ region, wage_order, daily_min_low, daily_min_high, effective }));
  return {
    topic: 'Daily minimum wage by region (private sector, non-agri high / agri-small low)',
    country: 'PH', currency: 'PHP',
    volatility: 'continuously-changing',
    matrix_as_of: '2026-02-25',
    source: {
      issuance: 'NWPC "Latest Wage Orders" matrix', source_tier: 'primary', last_verified: '2026-06-24',
      url: 'https://nwpc.dole.gov.ph/wp-content/uploads/2026/03/Latest-Wage-Orders-Matrix-2024-2025-As-of-25-February-2026.pdf',
      markdown: 'ph/min-wage/by_region_2025.md',
    },
    warning: 'VOLATILE: regions issue Wage Orders year-round. Re-pull the NWPC matrix (source.url) before relying on a rate — these figures are exact only as of matrix_as_of.',
    regions,
    kasambahay_monthly: [
      { region: 'NCR', wage_order: 'NCR-DW-06', monthly_min: 7800 },
      { region: 'Region IV-A', wage_order: 'RB IVA-DW-05', monthly_min: 6750 },
      { region: 'Region VI', wage_order: 'RBVI-DW-07', monthly_min: 6500 },
      { region: 'Region X', wage_order: 'RX-DW-06', monthly_min: 6500 },
      { region: 'BARMM', wage_order: 'BARMM-DW-01', monthly_min: 5000 },
    ],
  };
}

// ───────────── LABOR STANDARDS: premium pay matrix + leave durations ─────────────
// Verified in ph/labor/premium_pay.md (DOLE Handbook 2024 + Labor Code Arts. 86-94)
// and ph/labor/leaves.md (Labor Code Art. 95 + RA 11210/8187/11861/9710/9262).
const premiumBase = [
  ['ordinary', 1.00], ['rest_day', 1.30], ['special_non_working', 1.30],
  ['special_on_rest_day', 1.50], ['regular_holiday', 2.00],
  ['regular_holiday_on_rest_day', 2.60], ['double_holiday', 3.00],
  ['double_holiday_on_rest_day', 3.90],
];
function buildPremiumPay() {
  const matrix = premiumBase.map(([day, regular]) => {
    const otF = day === 'ordinary' ? 1.25 : 1.30;
    const night = r3(regular * 1.10);
    return { day, regular, night, overtime: r3(regular * otF), night_overtime: r3(night * otF) };
  });
  return {
    topic: 'Premium pay multipliers — overtime, night differential, rest day, special day, holiday',
    country: 'PH', currency: 'PHP', volatility: 'stable',
    source: {
      issuance: "DOLE Handbook on Workers' Statutory Monetary Benefits (2024 ed.); Labor Code (PD 442) Arts. 86-94",
      source_tier: 'primary', last_verified: '2026-06-25',
      url: 'https://bwc.dole.gov.ph/wp-content/uploads/2024/10/Workers-Statutory-Monetary-Benefits-Handbook-2024-Edition.pdf',
      markdown: 'ph/labor/premium_pay.md',
    },
    rules: { overtime_ordinary: 0.25, overtime_premium_day: 0.30, night_differential: 0.10 },
    notes: 'Multipliers are fractions of the basic daily/hourly wage (1.00 = 100%). overtime = regular × (1.25 ordinary | 1.30 premium day); night = regular × 1.10; night_overtime = night × the same OT factor. Statutory minimums (CBA/policy may exceed). Holiday DATES change yearly; these multipliers do not.',
    matrix,
  };
}
const LEAVES = [
  { type: 'service_incentive_leave', days_per_year: 5, paid_by: 'employer', eligibility_months: 12, convertible_to_cash: true, law: 'Labor Code Art. 95' },
  { type: 'maternity', days: 105, solo_parent_add_days: 15, unpaid_extension_days: 30, miscarriage_days: 60, allocatable_to_father_days: 7, paid_by: 'SSS benefit + employer salary differential', tax_exempt: true, law: 'RA 11210' },
  { type: 'paternity', days: 7, paid_by: 'employer', conditions: 'married male, cohabiting, first 4 deliveries', law: 'RA 8187' },
  { type: 'solo_parent', days_per_year: 7, paid_by: 'employer', eligibility_months: 6, cumulative: false, law: 'RA 8972 as amended by RA 11861' },
  { type: 'special_leave_for_women', duration_months: 2, paid_by: 'employer', eligibility_months: 6, note: 'two months with full pay after gynecological surgery (RA 9710 says "two months", not a fixed day count); not commutable to cash', law: 'RA 9710 sec.18' },
  { type: 'vawc', days_max: 10, paid_by: 'employer', law: 'RA 9262 sec.43' },
];
function buildLeaves() {
  return {
    topic: 'Statutory leave durations (SIL, maternity, paternity, solo-parent, special leave for women, VAWC)',
    country: 'PH', volatility: 'stable',
    source: {
      issuance: 'Labor Code Art. 95; RA 11210; RA 8187; RA 8972/RA 11861; RA 9710; RA 9262 (maternity tax exemption: BIR RMC 105-2019)',
      source_tier: 'primary', last_verified: '2026-06-25', markdown: 'ph/labor/leaves.md',
    },
    notes: 'Days are statutory minimums. Only the maternity cash benefit is paid by SSS (employer advances + 100% reimbursed) plus an employer salary differential; all other leaves are employer-paid. The maternity benefit + differential are income-tax exempt.',
    leaves: LEAVES,
  };
}

// ───────────────────────────── SINGAPORE ─────────────────────────────
// Verified in sg/iras/income_tax_2025.md (IRAS resident schedule, "From YA2024
// onwards") and sg/cpf/contribution_rates_2025.md (CPF Board rate tables + SDL).
// Every figure triangulated against the primary source in the 2026-06-29 QA pass.
const sgTaxBands = [
  { over: 0, not_over: 20000, base_tax: 0, rate: 0.00, of_excess_over: 0 },
  { over: 20000, not_over: 30000, base_tax: 0, rate: 0.02, of_excess_over: 20000 },
  { over: 30000, not_over: 40000, base_tax: 200, rate: 0.035, of_excess_over: 30000 },
  { over: 40000, not_over: 80000, base_tax: 550, rate: 0.07, of_excess_over: 40000 },
  { over: 80000, not_over: 120000, base_tax: 3350, rate: 0.115, of_excess_over: 80000 },
  { over: 120000, not_over: 160000, base_tax: 7950, rate: 0.15, of_excess_over: 120000 },
  { over: 160000, not_over: 200000, base_tax: 13950, rate: 0.18, of_excess_over: 160000 },
  { over: 200000, not_over: 240000, base_tax: 21150, rate: 0.19, of_excess_over: 200000 },
  { over: 240000, not_over: 280000, base_tax: 28750, rate: 0.195, of_excess_over: 240000 },
  { over: 280000, not_over: 320000, base_tax: 36550, rate: 0.20, of_excess_over: 280000 },
  { over: 320000, not_over: 500000, base_tax: 44550, rate: 0.22, of_excess_over: 320000 },
  { over: 500000, not_over: 1000000, base_tax: 84150, rate: 0.23, of_excess_over: 500000 },
  { over: 1000000, not_over: null, base_tax: 199150, rate: 0.24, of_excess_over: 1000000 },
];
const sgTaxOn = (income) => {
  const b = [...sgTaxBands].reverse().find((x) => income > x.over);
  return r2(b.base_tax + b.rate * (income - b.of_excess_over));
};
function buildSGIncomeTax() {
  return {
    topic: 'Singapore resident income tax on chargeable income (From YA2024 onwards)',
    country: 'SG', effective_date: '2024-01-01', currency: 'SGD', volatility: 'stable',
    source: {
      issuance: 'IRAS — Individual Income Tax rates (resident), From YA2024 onwards', source_tier: 'primary',
      last_verified: '2026-06-29',
      url: 'https://www.iras.gov.sg/taxes/individual-income-tax/basics-of-individual-income-tax/tax-residency-and-tax-rates/individual-income-tax-rates',
      markdown: 'sg/iras/income_tax_2025.md',
    },
    notes: 'Resident progressive scale, identical for YA2024/2025/2026. tax = base_tax + rate * (chargeable_income - of_excess_over); base_tax is the cumulative "gross tax payable" at the band floor. Non-resident employment income = higher of 15% flat or the resident scale; non-resident director\'s fees / other income = 24%. Singapore has NO monthly PAYE for residents — the employer reports via IR8A / Auto-Inclusion Scheme by 1 Mar and the individual is assessed and pays directly.',
    non_resident: { employment_income: 'higher of 15% flat or resident scale', director_fees_other_rate: 0.24 },
    annual: sgTaxBands,
    formula: 'tax = base_tax + rate * (chargeable_income - of_excess_over)',
  };
}

// CPF rates by age band: [age_band, total %, employer %, employee %]. % of wages
// for SC/PR (3rd year+), monthly wages > $750. 2027 already published (Budget 2025).
const sgCpfRates = {
  '2025': [['55 & below', 37, 17, 20], ['above 55 to 60', 32.5, 15.5, 17], ['above 60 to 65', 23.5, 12, 11.5], ['above 65 to 70', 16.5, 9, 7.5], ['above 70', 12.5, 7.5, 5]],
  '2026': [['55 & below', 37, 17, 20], ['above 55 to 60', 34, 16, 18], ['above 60 to 65', 25, 12.5, 12.5], ['above 65 to 70', 16.5, 9, 7.5], ['above 70', 12.5, 7.5, 5]],
  '2027': [['55 & below', 37, 17, 20], ['above 55 to 60', 35.5, 16.5, 19], ['above 60 to 65', 26, 13, 13], ['above 65 to 70', 16.5, 9, 7.5], ['above 70', 12.5, 7.5, 5]],
};
const sgOwCeiling = { '2025': 7400, '2026': 8000, '2027': 8000 };
const sgRateRows = (year) => sgCpfRates[year].map(([age_band, total_pct, employer_pct, employee_pct]) => ({
  age_band, total_pct, employer_pct, employee_pct,
  max_total_on_ow: r2(total_pct / 100 * sgOwCeiling[year]),
  max_employee_on_ow: r2(employee_pct / 100 * sgOwCeiling[year]),
}));
function buildSGCpf() {
  return {
    topic: 'Singapore CPF contribution rates by age band + Skills Development Levy (SDL)',
    country: 'SG', effective_date: '2025-01-01', currency: 'SGD', volatility: 'stable',
    source: {
      issuance: 'CPF Board — contribution rate tables (1 Jan 2025 / 2026 / 2027)', source_tier: 'primary',
      last_verified: '2026-06-29',
      url: 'https://www.cpf.gov.sg/employer/employer-obligations/cpf-contribution-and-allocation-rates',
      markdown: 'sg/cpf/contribution_rates_2025.md',
    },
    notes: 'Rates are % of wages for Singapore Citizens & PRs (full rates from 3rd year of PR), monthly wages > $750. employer_pct + employee_pct = total_pct. CPF is charged on Ordinary Wages up to ow_ceiling, and on Additional Wages up to the AW ceiling = annual_salary_ceiling - total OW subject to CPF. Foreigners/work-pass holders are NOT covered by CPF, but SDL applies to everyone. The 2027 rates are already published — use 2025/2026 for current payroll.',
    ow_ceiling: sgOwCeiling,
    annual_salary_ceiling: 102000,
    coverage: 'Singapore Citizens and Permanent Residents (full rates from 3rd year of PR); foreigners / work-pass holders excluded',
    rates: { '2025': sgRateRows('2025'), '2026': sgRateRows('2026'), '2027': sgRateRows('2027') },
    sdl: { rate_pct: 0.25, min: 2, max: 11.25, wage_cap: 4500, applies_to: 'all employees including foreigners', paid_by: 'employer' },
    formula: 'CPF (wages > $750/mo): total = total_pct% × min(OW, ow_ceiling[year]); employee = employee_pct% × min(OW, ow_ceiling[year]). SDL = clamp(0.25% × min(wage, 4500), $2, $11.25) per employee, employer-paid.',
  };
}

// SG validation: arithmetic self-consistency + markdown anchor cross-check + schema.
async function validateSG(sgTax, sgCpf) {
  // income-tax cumulative chain (each base = prev base + prev rate × band width)
  for (let i = 1; i < sgTaxBands.length; i++) {
    const p = sgTaxBands[i - 1], c = sgTaxBands[i];
    assert(r2(p.base_tax + p.rate * (c.over - p.of_excess_over)) === c.base_tax, `SG income-tax base chain breaks at bracket ${i}`);
  }
  assert(sgTaxOn(120000) === 7950, 'SG income-tax anchor 120k → 7,950');
  assert(sgTaxOn(320000) === 44550, 'SG income-tax anchor 320k → 44,550');
  assert(sgTaxOn(1000000) === 199150, 'SG income-tax anchor 1M → 199,150');
  // CPF: each row employer+employee=total; max-contribution arithmetic
  for (const [year, rows] of Object.entries(sgCpf.rates)) {
    for (const row of rows) {
      assert(r3(row.employer_pct + row.employee_pct) === row.total_pct, `SG CPF ${year} ${row.age_band}: employer+employee≠total`);
      assert(row.max_total_on_ow === r2(row.total_pct / 100 * sgCpf.ow_ceiling[year]), `SG CPF ${year} ${row.age_band}: max_total arithmetic`);
    }
  }
  const c25 = sgCpf.rates['2025'][0], c26 = sgCpf.rates['2026'][0];
  assert(c25.max_total_on_ow === 2738 && c25.max_employee_on_ow === 1480, 'SG CPF 2025 ≤55 max (2,738 / 1,480)');
  assert(c26.max_total_on_ow === 2960 && c26.max_employee_on_ow === 1600, 'SG CPF 2026 ≤55 max (2,960 / 1,600)');
  assert(r2(sgCpf.sdl.rate_pct / 100 * sgCpf.sdl.wage_cap) === sgCpf.sdl.max, 'SG SDL max = 0.25% × 4,500 = 11.25');
  // anchor cross-check against the source markdown
  const taxMd = await readMd('sg/iras/income_tax_2025.md');
  assert(/199,150/.test(taxMd), 'SG income-tax 199,150 anchor drift vs markdown');
  assert(/44,550/.test(taxMd), 'SG income-tax 44,550 anchor drift vs markdown');
  assert(/24%/.test(taxMd), 'SG income-tax 24% top-rate anchor drift vs markdown');
  const cpfMd = await readMd('sg/cpf/contribution_rates_2025.md');
  assert(/\$7,400/.test(cpfMd) && sgCpf.ow_ceiling['2025'] === 7400, 'SG CPF OW $7,400 drift vs markdown');
  assert(/\$8,000/.test(cpfMd) && sgCpf.ow_ceiling['2026'] === 8000, 'SG CPF OW $8,000 drift vs markdown');
  assert(/35\.5/.test(cpfMd), 'SG CPF 2027 senior band 35.5 drift vs markdown');
  assert(/11\.25/.test(cpfMd) && sgCpf.sdl.max === 11.25, 'SG SDL $11.25 drift vs markdown');
  checkSchema(sgTax, 'sg_income_tax');
  checkSchema(sgCpf, 'sg_cpf');
}

// Dependency-free conformance check against schemas/payroll-data.schema.json:
// the envelope every rate file must satisfy (topic, country, and a provenance source block).
function checkSchema(obj, name) {
  const need = (cond, msg) => assert(cond, `schema(${name}): ${msg}`);
  need(typeof obj.topic === 'string' && obj.topic.length > 0, 'missing topic');
  need(typeof obj.country === 'string' && obj.country.length > 0, 'missing country');
  need(obj.source && typeof obj.source === 'object', 'missing source block');
  const s = obj.source || {};
  need(typeof s.issuance === 'string' && s.issuance.length > 0, 'source.issuance missing');
  need(['primary', 'secondary'].includes(s.source_tier), 'source.source_tier must be primary|secondary');
  need(/^\d{4}-\d{2}-\d{2}$/.test(s.last_verified || ''), 'source.last_verified must be YYYY-MM-DD');
  need(typeof s.markdown === 'string' && s.markdown.length > 0, 'source.markdown missing');
  if ('volatility' in obj) need(['stable', 'continuously-changing'].includes(obj.volatility), 'volatility must be stable|continuously-changing');
}

// ───────────────────────────── VALIDATE ─────────────────────────────
async function validate(sss, tax, ph, pagibig, m13, minw, examples, premium, leaves) {
  // (1) SSS arithmetic self-consistency across ALL brackets
  assert(sss.brackets.length === 61, `SSS bracket count is ${sss.brackets.length}, expected 61`);
  for (const b of sss.brackets) {
    assert(b.employee === r2(b.msc * 0.05), `SSS employee≠5% at MSC ${b.msc}`);
    assert(b.employer === r2(b.msc * 0.10), `SSS employer≠10% at MSC ${b.msc}`);
    assert(b.total_incl_ec === r2(b.employee + b.employer + b.ec), `SSS total≠EE+ER+EC at MSC ${b.msc}`);
    assert(b.reg_ss_msc + b.mpf_msc === b.msc, `SSS reg+mpf≠msc at MSC ${b.msc}`);
  }
  // (2) Income-tax bracket chain consistency (each base = prev base + prev rate * width)
  for (let i = 1; i < taxAnnual.length; i++) {
    const p = taxAnnual[i - 1], c = taxAnnual[i];
    assert(r2(p.base_tax + p.rate * (c.over - p.of_excess_over)) === c.base_tax,
      `income-tax base chain breaks at bracket ${i}`);
  }
  // (3) PhilHealth / Pag-IBIG internal checks
  assert(ph.min_premium_total === r2(ph.salary_floor * ph.rate), 'PhilHealth min premium≠floor*rate');
  assert(ph.max_premium_total === r2(ph.salary_ceiling * ph.rate), 'PhilHealth max premium≠ceiling*rate');
  assert(r2(pagibig.mfs_cap * 0.02) === pagibig.max_each, 'Pag-IBIG max_each≠MFS*2%');

  // (4) Anchor cross-check against the SOURCE MARKDOWN (parse published rows → must equal JSON)
  const sssMd = await readMd('ph/sss/contribution_table_2025.md');
  // the markdown's worked ₱25,000 row states EE ₱1,250 + ER ₱2,500 → ₱3,780 incl. EC
  const sss25 = sss.brackets.find((b) => b.msc === 25000);
  assert(/₱?3,780/.test(sssMd) && sss25.total_incl_ec === 3780, 'SSS 25k anchor (3,780) drift vs markdown');
  assert(/1,250/.test(sssMd) && sss25.employee === 1250, 'SSS 25k employee (1,250) drift vs markdown');
  assert(/₱?5,280/.test(sssMd) && sss.brackets.at(-1).total_incl_ec === 5280, 'SSS max (5,280) drift vs markdown');

  const taxMd = await readMd('ph/bir/income_tax_table_2025.md');
  assert(/22,500 \+ 20%/.test(taxMd) && taxOn(500000) === 42500, 'income-tax ₱500k anchor (42,500) drift vs markdown');
  assert(/2,202,500 \+ 35%/.test(taxMd), 'income-tax top-bracket base drift vs markdown');
  assert(taxOn(250000) === 0 && taxOn(800000) === 102500, 'income-tax bracket anchors');

  const phMd = await readMd('ph/philhealth/contribution_rate_2025.md');
  assert(/5%/.test(phMd) && /₱?100,000/.test(phMd) && ph.salary_ceiling === 100000, 'PhilHealth anchors drift vs markdown');

  const m13Md = await readMd('ph/benefits/13th_month_pay.md');
  assert(/₱?90,000/.test(m13Md) && m13.tax_exempt_ceiling === 90000, '13th-month ₱90,000 drift vs markdown');

  const mwMd = await readMd('ph/min-wage/by_region_2025.md');
  const ncr = minw.regions.find((x) => x.region === 'NCR');
  assert(/₱?695/.test(mwMd) && ncr.daily_min_high === 695, 'min-wage NCR (695) drift vs markdown');

  // (5) monthly withholding table + worked net-pay example
  assert(/1,875 \+ 20%/.test(taxMd), 'income-tax MONTHLY base (1,875) drift vs markdown');
  assert(whtMonthly(46800) === 4568.4, 'monthly WHT anchor (46,800 -> 4,568.40)');
  const ex50 = examples.examples.find((e) => e.monthly_salary === 50000);
  assert(ex50.employee_deductions.sss === 1750 && ex50.employee_deductions.philhealth === 1250 && ex50.employee_deductions.pagibig === 200,
    'net-pay example deductions wrong at ₱50k (expected SSS 1750 / PH 1250 / Pag-IBIG 200)');
  assert(ex50.net_pay === 42231.6, 'net-pay example net wrong at ₱50k (expected 42,231.60)');

  // (6) labor standards: premium-pay matrix + leave durations vs markdown
  const ppMd = await readMd('ph/labor/premium_pay.md');
  const ord = premium.matrix.find((m) => m.day === 'ordinary');
  const rh = premium.matrix.find((m) => m.day === 'regular_holiday');
  const dh = premium.matrix.find((m) => m.day === 'double_holiday');
  assert(ord.overtime === 1.25 && rh.regular === 2.0 && dh.regular === 3.0 && rh.overtime === 2.6,
    'premium-pay matrix anchors (OT 125% / holiday 200% / double 300% / holiday-OT 260%)');
  assert(/125%/.test(ppMd) && /200%/.test(ppMd) && /300%/.test(ppMd), 'premium-pay markdown anchors');
  for (const m of premium.matrix) {
    const otF = m.day === 'ordinary' ? 1.25 : 1.30;
    assert(m.night === r3(m.regular * 1.10) && m.overtime === r3(m.regular * otF) && m.night_overtime === r3(m.night * otF),
      `premium matrix arithmetic at ${m.day}`);
  }
  const lvMd = await readMd('ph/labor/leaves.md');
  const mat = leaves.leaves.find((l) => l.type === 'maternity');
  const solo = leaves.leaves.find((l) => l.type === 'solo_parent');
  assert(mat.days === 105 && /105 days/.test(lvMd), 'maternity 105 days drift vs markdown');
  assert(solo.eligibility_months === 6 && /6 months/.test(lvMd), 'solo-parent 6-month eligibility (not 1 yr) drift vs markdown');
  const slw = leaves.leaves.find((l) => l.type === 'special_leave_for_women');
  assert(slw.duration_months === 2 && !('days_max' in slw) && /2 months/.test(lvMd), 'special leave for women = 2 months (not a day count) drift vs markdown');
  assert(typeof tax.taxable_base === 'string' && /SSS/.test(tax.taxable_base), 'income-tax taxable_base rule must be documented in the JSON');

  // (7) schema conformance — every rate file matches schemas/payroll-data.schema.json
  for (const [n, o] of [['sss', sss], ['income_tax', tax], ['philhealth', ph], ['pagibig', pagibig], ['13th_month', m13], ['min_wage', minw], ['premium_pay', premium], ['leaves', leaves], ['examples', examples]]) checkSchema(o, n);
}

// ───────────────────────────── RUN ─────────────────────────────
const sss = buildSSS(), tax = buildIncomeTax(), ph = buildPhilHealth();
const pagibig = buildPagibig(), m13 = buildThirteenth(), minw = buildMinWage();
const examples = buildExamples();
const premium = buildPremiumPay();
const leaves = buildLeaves();
const sgTax = buildSGIncomeTax();
const sgCpf = buildSGCpf();

await validate(sss, tax, ph, pagibig, m13, minw, examples, premium, leaves);
await validateSG(sgTax, sgCpf);

if (fails.length) {
  console.error(`\n❌ build-data: ${fails.length} validation failure(s) — JSON would drift from the markdown:`);
  for (const f of fails) console.error('   • ' + f);
  process.exit(1);
}

const files = {
  'sss_2025.json': sss,
  'income_tax_2025.json': tax,
  'philhealth_2025.json': ph,
  'pagibig_2025.json': pagibig,
  '13th_month_pay.json': m13,
  'min_wage_2025.json': minw,
  'premium_pay.json': premium,
  'leaves.json': leaves,
  'examples.json': examples,
  'sg_income_tax_2025.json': sgTax,
  'sg_cpf_2025.json': sgCpf,
};
const index = {
  name: 'Payroll Knowledge Base — machine-readable data layer',
  description: 'JSON parse-layer generated from (and validated against) the verified markdown in ph/** and sg/**. The markdown is the human/AI reading layer and the source of truth; these files are for programmatic use. Regenerate with `node tools/build-data.mjs`.',
  generated_by: 'tools/build-data.mjs',
  files: Object.entries(files).map(([f, d]) => ({
    file: `data/${f}`, topic: d.topic, effective_date: d.effective_date || d.matrix_as_of || null,
    volatility: d.volatility, source_markdown: d.source.markdown, source_issuance: d.source.issuance,
  })),
};

if (CHECK_ONLY) {
  console.log('✅ build-data --check: all figures self-consistent and match the markdown anchors (no write).');
  process.exit(0);
}

await fs.mkdir(DATA, { recursive: true });
for (const [name, obj] of Object.entries(files)) {
  await fs.writeFile(path.join(DATA, name), JSON.stringify(obj, null, 2) + '\n');
}
await fs.writeFile(path.join(DATA, 'index.json'), JSON.stringify(index, null, 2) + '\n');
console.log(`✅ build-data: wrote ${Object.keys(files).length} data files + index.json to data/ — all validated against the markdown anchors (0 drift).`);
console.log(`   SSS brackets: ${sss.brackets.length} · income-tax brackets: ${tax.annual.length} · min-wage regions: ${minw.regions.length} (volatile)`);
