import { test, expect } from '@playwright/test';
import path from 'path';

const formPath = path.resolve(__dirname, '..', '..', 'public', 'swift-form1.html').replace(/\\/g, '/');
const formUrl = `file:///${formPath}`;

test.beforeEach(async ({ page }) => {
    await page.goto(formUrl);
});

test('TC-001: Sender BIC field should be visible and editable', async ({ page }) => {
    const bicField = page.locator('#senderBic');
    await expect(bicField).toBeVisible();
    await expect(bicField).toBeEnabled();
});

test('TC-002: Valid MT103 payment should submit successfully', async ({ page }) => {
    await page.locator('#senderBic').fill('DEUTDEDB');
    await page.locator('#receiverBic').fill('HSBCGB2L');
    await page.locator('#iban').fill('GB29NWBK60161331926819');
    await page.locator('#currency').fill('USD');
    await page.locator('#amount').fill('10000.00');
    await page.locator('#submitBtn').click();

    const result = page.locator('#result');
    await expect(result).toHaveText('Payment Submitted');
});

test('TC-003: All required MT103 fields should be present on the form', async ({ page }) => {
    await expect(page.locator('#senderBic')).toBeVisible();
    await expect(page.locator('#receiverBic')).toBeVisible();
    await expect(page.locator('#iban')).toBeVisible();
    await expect(page.locator('#currency')).toBeVisible();
    await expect(page.locator('#amount')).toBeVisible();
    await expect(page.locator('#submitBtn')).toBeVisible();
});