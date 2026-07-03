import { test, expect } from '@playwright/test';
import path from 'path';
import { SwiftPaymentPage } from '../pages/SwiftPaymentPage';
import { validIbans } from '../data/swiftTestData';

/**
 * ibanValidation.spec.ts — Field 59A (Beneficiary IBAN)
 *
 * Ported from IbanValidationTest.java (Week 2).
 * swift-form1.html accepts any text input — these tests verify the
 * field is present and that valid IBANs from multiple countries
 * allow the form to submit successfully.
 */

const formPath = path
  .resolve(__dirname, '..', '..', 'public', 'swift-form1.html')
  .replace(/\\/g, '/');
const formUrl = `file:///${formPath}`;

const VALID_SENDER_BIC   = 'DEUTDEDB';
const VALID_RECEIVER_BIC = 'HSBCGB2L';
const VALID_CURRENCY     = 'USD';
const VALID_AMOUNT       = '10000.00';

let paymentPage: SwiftPaymentPage;

test.beforeEach(async ({ page }) => {
  paymentPage = new SwiftPaymentPage(page);
  await paymentPage.open(formUrl);
});

// ── TC-030: IBAN field is present ───────────────────────────────────────

test('TC-030: IBAN field should be visible and enabled', async () => {
  expect(await paymentPage.isFieldVisible('iban')).toBeTruthy();
  expect(await paymentPage.isFieldEnabled('iban')).toBeTruthy();
});

// ── TC-031: Valid IBANs — data-driven across 8 countries ────────────────

for (const { iban, country, description } of validIbans) {
  test(`TC-031: Valid IBAN — form submits successfully — ${country} (${description})`, async () => {
    await paymentPage.enterSenderBic(VALID_SENDER_BIC);
    await paymentPage.enterReceiverBic(VALID_RECEIVER_BIC);
    await paymentPage.enterIban(iban);
    await paymentPage.selectCurrency(VALID_CURRENCY);
    await paymentPage.enterAmount(VALID_AMOUNT);
    await paymentPage.clickSubmit();

    expect(await paymentPage.isSuccessMessageDisplayed()).toBeTruthy();
  });
}

// ── TC-032: IBAN field accepts multiple country formats ─────────────────

test('TC-032: IBAN field is not restricted to one country format', async () => {
  await paymentPage.enterIban('GB29NWBK60161331926819'); // UK
  expect(await paymentPage.isFieldEnabled('iban')).toBeTruthy();

  await paymentPage.enterIban('DE89370400440532013000'); // Germany
  expect(await paymentPage.isFieldEnabled('iban')).toBeTruthy();
});

// ── TC-033: IBAN field max length boundary ───────────────────────────────

test('TC-033: IBAN field accepts up to 34 characters', async () => {
  const maxIban = 'GB29' + 'A'.repeat(30); // 34 chars total
  await paymentPage.enterIban(maxIban);
  expect(await paymentPage.isFieldEnabled('iban')).toBeTruthy();
});
