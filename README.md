![Playwright SWIFT MT103 Tests](https://github.com/akpradhan86-sudo/playwright-swift-tests/actions/workflows/playwright-tests.yml/badge.svg)

# playwright-swift-tests

A **Playwright + TypeScript** UI test automation suite validating a simulated **SWIFT MT103** payment entry form — a direct port of the [`selenium-swift-tests`](https://github.com/akpradhan86-sudo/selenium-swift-tests) suite, built to compare Selenium/Java and Playwright/TypeScript implementations of the same Page Object Model design.

This is a personal portfolio project. Tests run against the same static local HTML form (`swift-form1.html`) used in the Selenium version — not a live banking application.

## What it does

- Automates data-driven MT103 field-validation scenarios for **BIC**, **IBAN**, currency, and amount using centralized TypeScript test-data modules.
- Applies the same Page Object Model separation (locators/actions vs. test logic/assertions) as the Selenium suite, translated into Playwright's async/await API.
- Captures screenshots on failure and generates HTML + list reports.

## Tech stack

| Layer | Tool |
|---|---|
| Language | TypeScript |
| UI automation | Playwright (`@playwright/test` ^1.61) |
| CI | GitHub Actions |

## Project structure

```
src/
├── data/
│   └── swiftTestData.ts        # BIC / IBAN / currency / amount test data sets
├── pages/
│   └── SwiftPaymentPage.ts     # Page Object — locators + actions for the MT103 form
└── tests/
    ├── bicValidation.spec.ts   # BIC field-format validation scenarios
    ├── happyPath.spec.ts       # Valid end-to-end submission scenarios
    └── ibanValidation.spec.ts  # IBAN field-format validation scenarios
public/
└── swift-form1.html             # Static simulated MT103 payment entry form
```

## Running locally

```bash
npm ci
npx playwright install --with-deps chromium
npx playwright test
```

## CI

GitHub Actions installs Node.js and Playwright's bundled Chromium, runs the full suite headlessly on every push and pull request to `main`, and uploads the HTML report as a build artifact.

## Why this exists alongside the Selenium version

Built to demonstrate that the same automation design principles — clean POM separation, data-driven test cases, CI-driven headless execution — carry across frameworks and languages, rather than being tied to one toolchain.

## Known limitations / next steps

- Same static-form scope as the Selenium suite — no live backend or async network state to handle yet.
- Planned: consolidate shared test data between the Selenium and Playwright suites instead of maintaining it twice, and extend both against a small real backend.
