import { Page, Locator, expect } from '@playwright/test';

/**
 * SwiftPaymentPage — Page Object Model for swift-form1.html
 *
 * Ported from SwiftPaymentPage.java (Selenium POM, Week 2).
 * Same principles, Playwright-native syntax:
 *   - Locators are private readonly fields
 *   - Actions are public async methods
 *   - No assertions inside this class — that's the test's job
 *   - Constructor takes Page (equivalent to Java's WebDriver)
 *   - Methods return `this` where chaining helps readability
 *
 * NOTE: swift-form1.html is a simple form — 5 plain text inputs,
 * one submit button, one <p id="result"> paragraph. No dropdown,
 * no inline error messages (same constraint as the Selenium POM).
 */
export class SwiftPaymentPage {
  private readonly page: Page;

  // ── Locators — matched exactly to swift-form1.html ids ────────────────
  private readonly senderBicField: Locator;
  private readonly receiverBicField: Locator;
  private readonly ibanField: Locator;
  private readonly currencyField: Locator;
  private readonly amountField: Locator;
  private readonly submitButton: Locator;
  private readonly resultParagraph: Locator;

  constructor(page: Page) {
    this.page = page;

    this.senderBicField   = page.locator('#senderBic');
    this.receiverBicField = page.locator('#receiverBic');
    this.ibanField         = page.locator('#iban');
    this.currencyField     = page.locator('#currency');
    this.amountField       = page.locator('#amount');
    this.submitButton      = page.locator('#submitBtn');
    this.resultParagraph   = page.locator('#result');
  }

  // ── Navigation ────────────────────────────────────────────────────────

  /** Open the MT103 form. Always call this at the start of each test. */
  async open(url: string): Promise<this> {
    await this.page.goto(url);
    await expect(this.submitButton).toBeVisible();
    return this;
  }

  // ── Field actions ─────────────────────────────────────────────────────

  async enterSenderBic(bic: string): Promise<this> {
    await this.senderBicField.fill(bic);
    return this;
  }

  async enterReceiverBic(bic: string): Promise<this> {
    await this.receiverBicField.fill(bic);
    return this;
  }

  async enterIban(iban: string): Promise<this> {
    await this.ibanField.fill(iban);
    return this;
  }

  /** swift-form1.html uses a plain text input — just type the currency code */
  async selectCurrency(currencyCode: string): Promise<this> {
    await this.currencyField.fill(currencyCode);
    return this;
  }

  async enterAmount(amount: string): Promise<this> {
    await this.amountField.fill(amount);
    return this;
  }

  /** swift-form1.html has no value date field — no-op, kept for parity with Java POM */
  async enterValueDate(_date: string): Promise<this> {
    return this;
  }

  // ── Submit ────────────────────────────────────────────────────────────

  async clickSubmit(): Promise<this> {
    await this.submitButton.click();
    return this;
  }

  // ── State getters ─────────────────────────────────────────────────────

  async isSuccessMessageDisplayed(): Promise<boolean> {
    const text = await this.resultParagraph.textContent();
    return (text ?? '').includes('Payment Submitted');
  }

  async getTransactionReference(): Promise<string> {
    return (await this.resultParagraph.textContent()) ?? '';
  }

  async isFieldVisible(fieldId: string): Promise<boolean> {
    return this.page.locator(`#${fieldId}`).isVisible();
  }

  async isFieldEnabled(fieldId: string): Promise<boolean> {
    return this.page.locator(`#${fieldId}`).isEnabled();
  }

  // ── Error message getters ─────────────────────────────────────────────
  // swift-form1.html has NO inline error divs — all return false,
  // matching the Java POM's behaviour for this simple form version.

  async isSenderBicErrorVisible(): Promise<boolean>   { return false; }
  async isReceiverBicErrorVisible(): Promise<boolean> { return false; }
  async isIbanErrorVisible(): Promise<boolean>         { return false; }
  async isCurrencyErrorVisible(): Promise<boolean>     { return false; }
  async isAmountErrorVisible(): Promise<boolean>       { return false; }
  async isValueDateErrorVisible(): Promise<boolean>    { return false; }

  // ── Convenience: fill all fields and submit ───────────────────────────

  async fillValidPaymentAndSubmit(payload: {
    senderBic: string;
    receiverBic: string;
    iban: string;
    currency: string;
    amount: string;
    valueDate?: string;
  }): Promise<this> {
    await this.enterSenderBic(payload.senderBic);
    await this.enterReceiverBic(payload.receiverBic);
    await this.enterIban(payload.iban);
    await this.selectCurrency(payload.currency);
    await this.enterAmount(payload.amount);
    await this.clickSubmit();
    return this;
  }
}
