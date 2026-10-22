# Empire Architect: Game Rules and AI Development Constraints

This document is the authoritative rulebook for gameplay, economy, persistence, and AI-assisted implementation.

## 1. Product identity

Build an original browser-based idle business tycoon currently titled **Empire Architect**. Broad genre conventions are acceptable inspiration. Do not copy proprietary art, exact UI layouts, names, descriptions, code, or progression content from existing games.

## 2. Version 1.0 boundaries

Must include:
- Dashboard and navigation.
- Eight original business categories.
- Purchasing and ownership.
- Upgrades.
- Idle income.
- Offline income with an eight-hour initial cap.
- Versioned local saves.
- Achievements and unlock progression.
- Responsive premium dark UI with restrained gold accents.
- Critical automated tests.

Do not add multiplayer, online leaderboards, AI rivals, stocks, crypto, employees, real estate, mergers, cloud accounts, or payments in version 1.0 unless explicitly approved as a scope change.

## 3. Starting balance seeds

- Starting cash: 1,000 credits.
- Parcel Relay cost: 250 credits.
- Parcel Relay base net income: 2 credits/sec.
- First upgrade seed: 150 credits.
- Offline cap: 8 hours.
- Offline rate: 100% of saved net income.

Treat these as tunable initial values, not immutable balance truth. Record and test any balance changes.

## 4. Initial business catalog

| ID | Name | Base cost | Base net income/sec |
|---|---|---:|---:|
| parcel-relay | Parcel Relay | 250 | 2 |
| corner-cafe | Corner Café | 1,000 | 8 |
| pixel-foundry | Pixel Foundry | 4,000 | 25 |
| greengrid-works | GreenGrid Works | 15,000 | 90 |
| artisan-collective | Artisan Collective | 60,000 | 300 |
| orbital-freight | Orbital Freight | 250,000 | 1,100 |
| nova-materials | Nova Materials | 1,200,000 | 4,800 |
| horizon-systems | Horizon Systems | 6,000,000 | 22,000 |

All business names, identities, and content are original game content.

## 5. Financial rules

- Cash is spendable.
- Lifetime earnings are cumulative and are not reduced by spending.
- Net worth is a display/progression metric, not spendable cash.
- Net income equals gross revenue minus operating expenses.
- Portfolio income is the sum of net income from owned businesses after valid multipliers.
- Never round intermediate calculations unnecessarily.
- All displayed values must be formatted consistently.
- Payback time uses incremental net income, not total portfolio income.

Suggested acquisition cost:
`nextCost = baseCost * growthRate ** ownedQuantity`

Suggested upgrade cost:
`upgradeCost = baseUpgradeCost * costGrowthRate ** currentLevel`

Suggested upgrade multiplier:
`multiplier = 1 + currentLevel * effectPerLevel`

These formulas may be tuned but must be centralized and tested.

## 6. Transaction rules

A transaction succeeds only when all preconditions pass. On failure, state must remain unchanged.

- No purchase with insufficient cash.
- No purchase of locked businesses.
- No negative or invalid quantity.
- No non-finite costs or income.
- No upgrade above configured maximum.
- No duplicate achievement reward.
- No sale exploit that refunds all investment and upgrade costs.
- Deduct cash and update ownership atomically.
- Display clear feedback for success or failure.

## 7. Simulation rules

- Income depends on elapsed time, not frame count.
- Use deterministic calculations for a given state and elapsed duration.
- Background tabs must not create thousands of unnecessary simulation steps.
- Invalid elapsed time must not generate income.
- Offline credit is clamped to the configured cap.
- Offline income uses the last saved portfolio in version 1.0.
- The same offline interval must not be credited repeatedly.
- Save the updated state after offline earnings are applied.
- Local-only offline progression is not guaranteed to be cheat-proof.

## 8. Save rules

- Use a versioned save envelope and stable app identifier.
- Validate data before use.
- Recompute derived values from authoritative state.
- Migrate only supported older versions.
- Keep a backup of valid state where practical.
- Never silently overwrite a valid save with malformed data.
- Surface storage failures honestly.
- Destructive reset requires confirmation.
- Browser storage is user-editable and must not be described as secure against cheating.

## 9. Achievement rules

- Evaluate conditions centrally.
- Mark completed achievements exactly once.
- Grant rewards exactly once.
- Store stable IDs, not display names, as identifiers.
- Conditions must use authoritative game state.
- Achievements must not create infinite reward loops.

## 10. Architecture rules

- UI must not calculate business costs or financial outcomes independently.
- Economy services must not manipulate the DOM.
- Persistence must not own game balance rules.
- Balance data must be configuration-driven.
- Save schema version and balance version are distinct.
- No circular dependencies.
- Keep modules testable without browser rendering.

## 11. UX and accessibility rules

- Premium dark dashboard, restrained gold accent.
- Positive and negative values must not rely on color alone.
- Visible keyboard focus.
- Respect reduced-motion preferences.
- No horizontal overflow on common mobile widths.
- Explain costs and expected income changes before purchases.
- Confirm reset and other destructive actions.
- Essential gameplay information cannot exist only in tooltips.

## 12. AI coding-agent behavior

When implementing:
1. Read all project documents before changing code.
2. Inspect the current repository and existing tests.
3. Implement only the current milestone.
4. Do not replace working code unnecessarily.
5. Add or update tests with each financial or persistence change.
6. Run available tests and report actual results.
7. Do not claim a test passed unless it was executed.
8. Do not invent dependencies, API keys, or external services.
9. Ask before changing scope, adding paid services, or introducing a backend.
10. Keep the project runnable after each milestone.
11. Document assumptions and unresolved decisions.
12. Preserve user data and never reset saves as a debugging shortcut without explicit approval.

## 13. Definition of done for each task

A task is done only when:
- Its acceptance criteria are met.
- Relevant tests are added and run.
- No unrelated functionality is broken.
- UI behavior is responsive and accessible where applicable.
- Errors are handled.
- Documentation is updated when architecture or rules change.
