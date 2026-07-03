/**
 * swiftTestData.ts — centralised test data for SWIFT field validation.
 *
 * Ported from SwiftTestData.java (Week 2 — TestNG @DataProvider methods).
 *
 * Java's @DataProvider returns Object[][] consumed via the `dataProvider`
 * attribute on @Test. Playwright has no built-in data-provider mechanism —
 * the idiomatic equivalent is a plain exported array, looped over with a
 * standard `for...of` to generate one `test()` per row. Same separation
 * of data from test logic, just native TypeScript instead of an annotation.
 */

// ── BIC Validation Data (Field 52A / 57A) ──────────────────────────────

export interface BicCase {
  bic: string;
  description: string;
}

/**
 * Valid BICs — all should allow the form to submit successfully.
 *
 * BIC format rules (ISO 9362):
 *   BBBB = 4-char bank code (letters only)
 *   CC   = 2-char country code (ISO 3166-1 alpha-2)
 *   LL   = 2-char location code (alphanumeric)
 *   BBB  = optional 3-char branch code (omit or use XXX for primary office)
 */
export const validBics: BicCase[] = [
  { bic: 'DEUTDEDB',    description: 'Deutsche Bank Frankfurt — standard 8-char BIC' },
  { bic: 'HSBCGB2L',    description: 'HSBC London — standard 8-char BIC' },
  { bic: 'CITIUS33',    description: 'Citibank New York — standard 8-char BIC' },
  { bic: 'BNPAFRPP',    description: 'BNP Paribas Paris — standard 8-char BIC' },
  { bic: 'ICICIINBB',   description: 'ICICI Bank India — standard 8-char BIC' },
  { bic: 'DEUTDEDBBER', description: 'Deutsche Bank Berlin branch — 11-char BIC' },
  { bic: 'HSBCGB2LXXX', description: 'HSBC London primary office — 11-char with XXX' },
  { bic: 'BNPAFRPPXXX', description: 'BNP Paribas head office — 11-char with XXX' },
];

/**
 * Note: swift-form1.html has no inline validation, so "invalid" BICs are
 * kept here for documentation/future use (e.g. once you add an API layer
 * in Weeks 7-9 with real server-side validation), but are not exercised
 * against this simple form's tests in Week 5.
 */
export const invalidBics: BicCase[] = [
  { bic: '',             description: 'Empty BIC — mandatory field' },
  { bic: 'DEUT',         description: '4 chars — too short' },
  { bic: 'DEUTDEDBB',    description: '9 chars — invalid length (not 8 or 11)' },
  { bic: 'DEUTDEDBBERR', description: '12 chars — too long' },
  { bic: 'DEUT DE DB',   description: 'Contains spaces — BIC must be contiguous' },
  { bic: '12345678',     description: 'All numeric — bank code must contain letters' },
];

// ── IBAN Validation Data (Field 59A) ────────────────────────────────────

export interface IbanCase {
  iban: string;
  country: string;
  description: string;
}

/**
 * Valid IBANs from multiple countries.
 *
 * IBAN format (ISO 13616):
 *   CC   = 2-char country code
 *   KK   = 2-char check digits (numeric, 02–98)
 *   BBAN = Basic Bank Account Number (country-specific, up to 30 chars)
 *   Total max length: 34 characters
 */
export const validIbans: IbanCase[] = [
  { iban: 'GB29NWBK60161331926819',       country: 'UK',          description: 'NatWest UK — 22 chars' },
  { iban: 'DE89370400440532013000',       country: 'Germany',     description: 'Deutsche Bank — 22 chars' },
  { iban: 'FR7630006000011234567890189',  country: 'France',      description: 'BNP Paribas France — 27 chars' },
  { iban: 'NL91ABNA0417164300',           country: 'Netherlands', description: 'ABN AMRO — 18 chars' },
  { iban: 'CH9300762011623852957',        country: 'Switzerland', description: 'UBS Switzerland — 21 chars' },
  { iban: 'ES9121000418450200051332',     country: 'Spain',       description: 'Santander Spain — 24 chars' },
  { iban: 'IT60X0542811101000000123456',  country: 'Italy',       description: 'UniCredit Italy — 27 chars' },
  { iban: 'IN00SBIN00000012345678901',    country: 'India',       description: 'SBI India format — 25 chars' },
];

export const invalidIbans: { iban: string; reason: string }[] = [
  { iban: '',                 reason: 'Empty IBAN — mandatory field' },
  { iban: '12345678',         reason: 'No country code — starts with digits' },
  { iban: 'GBXXNWBK60161331', reason: 'Non-numeric check digits (XX)' },
  { iban: 'G1',               reason: 'Too short — only 2 chars' },
  { iban: 'gb29nwbk60161331', reason: 'Lowercase — IBAN should be uppercase' },
];

// ── Happy Path Data ──────────────────────────────────────────────────────

export interface PaymentCase {
  senderBic: string;
  receiverBic: string;
  iban: string;
  currency: string;
  amount: string;
  valueDate: string;
  scenario: string;
}

/** Full valid MT103 payment scenarios for end-to-end happy path tests. */
export const validPayments: PaymentCase[] = [
  {
    senderBic: 'DEUTDEDB', receiverBic: 'HSBCGB2L',
    iban: 'GB29NWBK60161331926819', currency: 'USD',
    amount: '10000.00', valueDate: '2025-12-31',
    scenario: 'Standard USD wire — DE to UK',
  },
  {
    senderBic: 'BNPAFRPP', receiverBic: 'CITIUS33',
    iban: 'NL91ABNA0417164300', currency: 'EUR',
    amount: '5000.50', valueDate: '2025-11-30',
    scenario: 'EUR transfer — FR to US',
  },
  {
    senderBic: 'ICICIINBB', receiverBic: 'DEUTDEDB',
    iban: 'DE89370400440532013000', currency: 'GBP',
    amount: '250.00', valueDate: '2025-10-15',
    scenario: 'GBP remittance — India to Germany',
  },
];
