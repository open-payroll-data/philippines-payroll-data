// Programmatic entry point for the `philippines-payroll-data` package.
// Re-exports each verified rate table from data/. You can also import a single
// file directly:  import sss from 'philippines-payroll-data/data/sss_2025.json' with { type: 'json' }
//
// Every table carries a `source` block (issuance, source_tier, last_verified, markdown).
// Respect `volatility: "continuously-changing"` (today only minimum wage): re-pull the
// cited golden source before relying on those figures.
import { createRequire } from 'node:module';
// createRequire loads the JSON synchronously and works on every Node >=18 — it avoids the
// version-sensitive `import ... with { type: 'json' }` syntax. For tree-shaking, import a
// single table directly from './data/*.json' instead of this convenience barrel.
const require = createRequire(import.meta.url);

export const sss2025 = require('./data/sss_2025.json');
export const incomeTax2025 = require('./data/income_tax_2025.json');
export const philhealth2025 = require('./data/philhealth_2025.json');
export const pagibig2025 = require('./data/pagibig_2025.json');
export const thirteenthMonthPay = require('./data/13th_month_pay.json');
export const minWage2025 = require('./data/min_wage_2025.json');
export const premiumPay = require('./data/premium_pay.json');
export const leaves = require('./data/leaves.json');
export const examples = require('./data/examples.json');
// Singapore (sg/) tables
export const sgIncomeTax2025 = require('./data/sg_income_tax_2025.json');
export const sgCpf2025 = require('./data/sg_cpf_2025.json');
export const index = require('./data/index.json');

export default {
  sss2025,
  incomeTax2025,
  philhealth2025,
  pagibig2025,
  thirteenthMonthPay,
  minWage2025,
  premiumPay,
  leaves,
  examples,
  sgIncomeTax2025,
  sgCpf2025,
  index,
};
