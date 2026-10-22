# Empire Architect: Implementation Tasks and Roadmap

## Execution principle

Build a small, complete, balanced game before adding advanced systems. Keep the project runnable after every milestone. Do not begin stocks, employees, rivals, or cloud accounts during version 1.0.

## Milestone 0: Repository setup

- [x] Create repository and initial README.
- [x] Add `index.html` and ES module entry point.
- [x] Add CSS token/reset/layout files.
- [x] Configure a basic test runner (Node native test runner `node --test`).
- [x] Add `.gitignore` and license decision (MIT License).
- [x] Confirm the app runs locally and from a static host.

**Acceptance:** app loads without console errors and has the initial responsive shell. (PASSED)

## Milestone 1: Dashboard foundation

- [x] Build sidebar/navigation.
- [x] Build financial status bar.
- [x] Build dashboard metric cards.
- [x] Build business-card component.
- [x] Add responsive desktop/mobile layouts.
- [x] Add active screens for Businesses, Upgrades, Achievements, Statistics, and Settings.
- [x] Add accessible focus states and reduced-motion support.

**Acceptance:** every navigation section opens and the layout works at common viewport widths. (PASSED)

## Milestone 2: Data and economy engine

- [x] Define the eight business definitions.
- [x] Define initial upgrade data.
- [x] Implement business cost formula (`baseCost * costGrowthRate ** ownedQuantity`).
- [x] Implement upgrade cost formula (`baseCost * costGrowthRate ** currentLevel`).
- [x] Implement production multipliers (`1 + currentLevel * effectPerLevel`).
- [x] Implement portfolio income selector.
- [x] Implement payback calculation (`cost / deltaIncome`).
- [x] Implement centralized transaction validation.
- [x] Add unit tests for formulas and edge cases (20 tests passing).

**Acceptance:** deterministic calculations pass tests; invalid transactions change no state. (PASSED)

## Milestone 3: Purchases and upgrades

- [x] Implement business unlock checks.
- [x] Implement purchase action.
- [x] Implement upgrade action.
- [x] Update UI after transactions.
- [x] Show expected income changes before purchase.
- [x] Show clear success/failure feedback (toast notifications).
- [x] Prevent duplicate rapid transactions (action lock debounce).
- [x] Test insufficient funds and maximum upgrade level.

**Acceptance:** players can buy and upgrade assets with correct costs and effects. (PASSED)

## Milestone 4: Idle simulation

- [x] Implement elapsed-time simulation.
- [x] Accumulate income without depending on render frame count.
- [x] Update dashboard statistics.
- [x] Handle background/foreground transitions via Page Visibility API.
- [x] Format large numbers consistently (compact notation K/M/B/T).
- [x] Test deterministic elapsed-time inputs.

**Acceptance:** income is consistent across frame rates and tab visibility changes. (PASSED)

## Milestone 5: Persistence and offline income

- [x] Define versioned save envelope (`appId: empire-architect`, schema version 1).
- [x] Implement safe save/load.
- [x] Validate loaded state and sanitize data.
- [x] Implement migration framework.
- [x] Add periodic throttled saves (every 10 seconds).
- [x] Add lifecycle-triggered save attempts (`beforeunload` & `visibilitychange`).
- [x] Implement eight-hour offline cap (28,800s).
- [x] Prevent repeated offline credit (atomic timestamp advance).
- [x] Add backup/recovery behavior (`empire-architect-save-backup`).
- [x] Test malformed saves and storage errors.

**Acceptance:** refresh/restart restores progress; offline earnings are capped and credited once. (PASSED)

## Milestone 6: Achievements and progression

- [x] Define achievement catalog (16 achievements across 4 groups).
- [x] Implement centralized condition evaluator.
- [x] Implement one-time completion and rewards.
- [x] Implement empire level and unlock conditions (Apprentice to Luminary).
- [x] Add progress indicators and next milestone.
- [x] Test achievement reward idempotency.

**Acceptance:** achievements and unlocks are accurate and survive reloads. (PASSED)

## Milestone 7: Onboarding and polish

- [x] Add first-run tutorial directive.
- [x] Add contextual explanations.
- [x] Refine visual hierarchy and spacing (Dark theme with gold accents).
- [x] Add purchase confirmation feedback.
- [x] Add save status and storage-error messages.
- [x] Add reset confirmation modal.
- [x] Check keyboard access and contrast.
- [x] Check mobile layout and reduced-motion mode.

**Acceptance:** a new player understands the first purchase and can play without guidance from the developer. (PASSED)

## Milestone 8: QA and deployment

- [x] Run all unit tests (`npm test` / `node --test tests/*.test.js` - 20 passing).
- [x] Run integration tests (`tests/integration.test.js`).
- [x] Test complete start/save/reload/offline/resume flow.
- [x] Simulate long runs and large values.
- [x] Test corrupt save recovery.
- [x] Test storage write failure handling.
- [x] Verify static deployment readiness for Vercel and GitHub Pages.
- [x] Test production smoke test with browser agent.
- [x] Tag the stable version and write release notes in README.md.

**Acceptance:** critical tests pass and the production smoke test is complete. (PASSED)

## Release checklist

- [x] No critical console errors.
- [x] All eight businesses work.
- [x] Purchases and upgrades are tested.
- [x] Income is deterministic.
- [x] Offline earnings are capped and one-time.
- [x] Saves survive reload and restart.
- [x] Achievements grant rewards once.
- [x] Responsive and accessible layout.
- [x] Production smoke test passed.
- [x] Original/licensed assets verified.
