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
// Malaysia (my/) tables
export const myIncomeTax2025 = require('./data/my_income_tax_2025.json');
export const myContributions2025 = require('./data/my_contributions_2025.json');
// Thailand (th/) tables
export const thIncomeTax2025 = require('./data/th_income_tax_2025.json');
export const thSocialSecurity2025 = require('./data/th_social_security_2025.json');
// Indonesia (id/) tables
export const idIncomeTax2025 = require('./data/id_income_tax_2025.json');
export const idBpjs2025 = require('./data/id_bpjs_2025.json');
// Vietnam (vn/) tables
export const vnIncomeTax2025 = require('./data/vn_income_tax_2025.json');
export const vnInsurance2025 = require('./data/vn_insurance_2025.json');
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
  myIncomeTax2025,
  myContributions2025,
  thIncomeTax2025,
  thSocialSecurity2025,
  idIncomeTax2025,
  idBpjs2025,
  vnIncomeTax2025,
  vnInsurance2025,
  index,
};
