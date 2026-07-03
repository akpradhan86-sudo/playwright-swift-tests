import { test, expect } from '@playwright/test';
import path from 'path';
import { SwiftPaymentPage } from '../pages/SwiftPaymentPage';
import { validPayments } from '../data/swiftTestData';

/**
 * happyPath.spec.ts — Full MT103 end-to-end payment submission.
 *
 * Ported from HappyPathTest.java (Week 2).
 * Uses fillValidPaymentAndSubmit() from SwiftPaymentPage to keep
 * tests concise — same convenience-method pattern as the Java POM.
 */

const formPath = path
  .resolve(__dirname, '..', '..', 'public', 'swift-form1.html')
  .replace(/\\/g, '/');
const formUrl = `file:///${formPath}`;

let paymentPage: SwiftPaymentPage;

test.beforeEach(async ({ page }) => {
  paymentPage = new SwiftPaymentPage(page);
  await paymentPage.open(formUrl);
});

// ── TC-070: Full valid MT103 payment — data-driven across 3 scenarios ───

for (const scenario of validPayments) {
  test(`TC-070: Full valid MT103 payment submits — ${scenario.scenario}`, async () => {
    await paymentPage.fillValidPaymentAndSubmit({
      senderBic: scenario.senderBic,
      receiverBic: scenario.receiverBic,
      iban: scenario.iban,
      currency: scenario.currency,
      amount: scenario.amount,
      valueDate: scenario.valueDate,
    });

    expect(await paymentPage.isSuccessMessageDisplayed()).toBeTruthy();
  });
}

// ── TC-071: Submit button still present after submission ────────────────

test('TC-071: Submit button should still be present after submission', async () => {
  await paymentPage.fillValidPaymentAndSubmit({
    senderBic: 'DEUTDEDB',
    receiverBic: 'HSBCGB2L',
    iban: 'GB29NWBK60161331926819',
    currency: 'USD',
    amount: '10000.00',
  });

  expect(await paymentPage.isSuccessMessageDisplayed()).toBeTruthy();

  // swift-form1.html button stays enabled after submit (no disabled attr) —
  // verify the submit button is still visible on the page
  expect(await paymentPage.isFieldVisible('submitBtn')).toBeTruthy();
});

// ── TC-072: All 5 MT103 fields present on the form ───────────────────────

test('TC-072: All 5 MT103 fields should be present on the form', async () => {
  expect(await paymentPage.isFieldVisible('senderBic')).toBeTruthy();
  expect(await paymentPage.isFieldVisible('receiverBic')).toBeTruthy();
  expect(await paymentPage.isFieldVisible('iban')).toBeTruthy();
  expect(await paymentPage.isFieldVisible('currency')).toBeTruthy();
  expect(await paymentPage.isFieldVisible('amount')).toBeTruthy();
  expect(await paymentPage.isFieldVisible('submitBtn')).toBeTruthy();
});
