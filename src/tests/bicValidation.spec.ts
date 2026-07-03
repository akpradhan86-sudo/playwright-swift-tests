import { test, expect } from '@playwright/test';
import path from 'path';
import { SwiftPaymentPage } from '../pages/SwiftPaymentPage';
import { validBics } from '../data/swiftTestData';

/**
 * bicValidation.spec.ts — Field 52A / 57A (Sender & Receiver BIC)
 *
 * Ported from BicValidationTest.java (Week 2).
 * Mirrors the same test IDs (TC-010 etc.) and structure:
 *   - extends BaseTest → here: a shared beforeEach instead of inheritance
 *   - uses SwiftPaymentPage via POM (no page.locator() calls in this file)
 *   - data-driven via validBics array (equivalent to @DataProvider)
 *
 * NOTE on chaining: SwiftPaymentPage methods return `this` (Promise<this>)
 * to mirror the Java POM's fluent style, but in async TypeScript the
 * cleanest way to use that is sequential `await` calls rather than
 * `.then()` chains — same fluent feel, more readable.
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

// ── TC-001/002: BIC fields are present ──────────────────────────────────

test('TC-001: Sender BIC field should be visible and enabled', async () => {
  expect(await paymentPage.isFieldVisible('senderBic')).toBeTruthy();
  expect(await paymentPage.isFieldEnabled('senderBic')).toBeTruthy();
});

test('TC-002: Receiver BIC field should be visible and enabled', async () => {
  expect(await paymentPage.isFieldVisible('receiverBic')).toBeTruthy();
  expect(await paymentPage.isFieldEnabled('receiverBic')).toBeTruthy();
});

// ── TC-010: Valid sender BICs — data-driven ─────────────────────────────
// Equivalent to @Test(dataProvider = "validBics") in Java —
// one test() generated per row in validBics, same as TestNG's iteration.

for (const { bic, description } of validBics) {
  test(`TC-010: Valid sender BIC fills and form submits — ${description}`, async () => {
    await paymentPage.enterSenderBic(bic);
    await paymentPage.enterReceiverBic('HSBCGB2L');
    await paymentPage.enterIban('GB29NWBK60161331926819');
    await paymentPage.selectCurrency('USD');
    await paymentPage.enterAmount('10000.00');
    await paymentPage.clickSubmit();

    expect(await paymentPage.isSuccessMessageDisplayed()).toBeTruthy();
  });
}

// ── TC-012: Valid receiver BICs — data-driven ───────────────────────────

for (const { bic, description } of validBics) {
  test(`TC-012: Valid receiver BIC fills and form submits — ${description}`, async () => {
    await paymentPage.enterSenderBic('DEUTDEDB');
    await paymentPage.enterReceiverBic(bic);
    await paymentPage.enterIban('GB29NWBK60161331926819');
    await paymentPage.selectCurrency('USD');
    await paymentPage.enterAmount('10000.00');
    await paymentPage.clickSubmit();

    expect(await paymentPage.isSuccessMessageDisplayed()).toBeTruthy();
  });
}

// ── TC-014: BIC fields accept input independently ───────────────────────

test('TC-014: Both BIC fields accept input independently', async () => {
  await paymentPage.enterSenderBic('DEUTDEDB');
  await paymentPage.enterReceiverBic('HSBCGB2L');

  expect(await paymentPage.isFieldEnabled('senderBic')).toBeTruthy();
  expect(await paymentPage.isFieldEnabled('receiverBic')).toBeTruthy();
});

// ── TC-015: Same BIC for sender and receiver (intra-bank) ───────────────

test('TC-015: Same BIC for both fields — intra-bank transfer', async () => {
  await paymentPage.enterSenderBic('DEUTDEDB');
  await paymentPage.enterReceiverBic('DEUTDEDB');
  await paymentPage.enterIban('DE89370400440532013000');
  await paymentPage.selectCurrency('EUR');
  await paymentPage.enterAmount('500.00');
  await paymentPage.clickSubmit();

  expect(await paymentPage.isSuccessMessageDisplayed()).toBeTruthy();
});
