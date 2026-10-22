# Empire Architect: Project Memory and Decision Log

This file preserves the current agreed project decisions and actual implementation history.

## 1. Project identity

- Working title: **Empire Architect**.
- Product type: original browser-based idle business tycoon.
- Platform: HTML5, Vanilla CSS3, Vanilla ES modules JavaScript.
- Visual theme: Premium dark dashboard with restrained metallic gold accents (`#0B0E13` background, `#D6AD58` gold).
- No external frameworks or backend required for Version 1.0.

## 2. Implementation status

- **Status**: Version 1.0 fully implemented and verified via unit tests and browser end-to-end testing.
- **Automated Tests**: 20/20 unit & integration tests passing (`tests/*.test.js`).
- **Interactive Verification**: Fully executed through automated browser subagent, confirming purchase loop, upgrades, achievement unlocks, persistent local storage, and modal flows.

## 3. Economy and progression specifications

- Starting Cash: 1,000 credits.
- Starting Empire Level: Level 1 (Apprentice Tycoon).
- 8 Original Fictional Businesses:
  1. Parcel Relay (Base Cost: 250, Base Income: 2/s, Level 1)
  2. Corner Café (Base Cost: 1,000, Base Income: 8/s, Level 2)
  3. Pixel Foundry (Base Cost: 4,000, Base Income: 25/s, Level 3)
  4. GreenGrid Works (Base Cost: 15,000, Base Income: 90/s, Level 4)
  5. Artisan Collective (Base Cost: 60,000, Base Income: 300/s, Level 5)
  6. Orbital Freight (Base Cost: 250,000, Base Income: 1,100/s, Level 6)
  7. Nova Materials (Base Cost: 1,200,000, Base Income: 4,800/s, Level 7)
  8. Horizon Systems (Base Cost: 6,000,000, Base Income: 22,000/s, Level 8)
- Cost Growth Formula: `nextCost = Math.floor(baseCost * (costGrowthRate ** ownedQuantity))`
- Upgrade Cost Formula: `upgradeCost = Math.floor(baseCost * (costGrowthRate ** currentLevel))`
- Upgrade Multipliers: `1 + sum(level * effectPerLevel)`
- Offline Earnings: 100% rate, capped at 8 hours (28,800 seconds), credited once upon session return.
- Net Worth: `Cash + Total Capital Invested in Businesses and Upgrades`.

## 4. Key architectural decisions made

- **Centralized Economy Engine**: Financial logic resides exclusively in `js/engine/economy.js`. UI components never calculate formulas or mutate state independently.
- **Atomic Transactions**: Purchases and upgrades in `js/engine/purchases.js` and `js/engine/upgrades.js` validate all preconditions (unlock status, sufficient funds, max level) before deducting funds.
- **Save Envelope**: Versioned envelope (`appId: "empire-architect"`, schema version 1, balance version 1) with automatic backup key (`empire-architect-save-backup`) and data sanitization migrations (`js/persistence/migrations.js`).
- **Simulation**: Uses elapsed wall-clock time (`requestAnimationFrame` with delta duration) to remain independent of render frame rates and tab backgrounding (`visibilitychange`).
- **Test Runner**: Utilizes Node.js native test runner (`node --test`) without third-party dependencies, guaranteeing rapid, reproducible CI testing.

## 5. Bugs identified and resolved during implementation

1. *Achievement Cash Accounting in Integration Test*: During initial integration test, `simulateTick` correctly triggered the "First Step" achievement (+50 credits). The test assertion was updated to reflect the reward.
2. *Cross-module Time Utility Export*: `formatDuration` and `formatPayback` were harmonized across `time.js` and `formatting.js` to eliminate browser module import mismatches.
3. *Dev Server Cache-Control*: Added `no-cache, no-store, must-revalidate` headers to local node test server so ES module updates are delivered immediately to browsers.

## 6. Deployment instructions

- **GitHub Pages**: Set source to root branch (`/`), `index.html` loads directly.
- **Vercel**: Deploy repository root as static website (zero build configuration required).

## 7. Visual Assets & Continuous Auto-Save Enhancement

- **High-Resolution Custom Illustrations**:
  - `assets/illustrations/banner.jpg`: Panoramic corporate headquarters skyline featured in the Dashboard milestone banner.
  - 8 Custom Business Artwork Headers (`assets/businesses/*.jpg`): Parcel Relay, Corner Café, Pixel Foundry, GreenGrid Works, Artisan Collective, Orbital Freight, Nova Materials, and Horizon Systems.
  - Revenue portfolio breakdown items render high-definition enterprise image thumbnails with dynamic revenue shares.
- **Continuous Auto-Save Engine**:
  - Upgraded periodic autosave frequency to every 3 seconds (`BALANCE.autosaveIntervalMs = 3000`).
  - Comprehensive lifecycle persistence across `pagehide`, `beforeunload`, and `visibilitychange`.
  - Immediate atomic auto-save upon every acquisition, technological upgrade, and achievement completion.
  - Live topbar badge with pulsing status indicators (`Auto-Saving...` -> `Auto-Saved`).
  - Real-time timestamp tracking and dedicated Continuous Auto-Save telemetry in the Settings view.

## 8. Version 2.0: Business Empire: RichMan Full 4-Pillar Replica

- **Completed & Verified:** Full mechanical and systemic recreation of *Business Empire: RichMan* inside our modular vanilla architecture:
  1. **Pillar 1: Commercial Enterprises & Mergers**:
     - 21-slot allocation system with `Owned: X / 21 Slots` constraint.
     - 12 Standard Industries (Retail Store, Restaurant, Taxi, Shipping, Car Dealership, Construction, Factory, Bank with interest spread sliders, IT Company with software staffing, Football Club, Airline with load factor, Oil & Gas up to Level 62).
     - 4 Corporate Mergers (Clothing Brand, Holding Company with $8.7B/hr passive, Space Agency with rocket exploration, Blockchain Platform).
  2. **Pillar 2: Capital Investments**:
     - Stock Market: 8 corporate blue chips with price drift, continuous dividend yields, and 100% company buyout mechanics.
     - Cryptocurrency: High-beta volatile swing trading (BitGold, Etherium, Solara, DogeMoon) with instant buy/sell trading desks.
     - Real Estate: Global properties (Lublin, London, Florida, Tokyo, Dubai) with 5 luxury upgrade tiers and 12% liquidation sales tax.
  3. **Pillar 3: Luxury Collection**:
     - Status wealth sinks: Supercars, Megayachts up to $45B (*The Garden*), Private Aircraft, and Private Islands contributing directly to Net Worth.
  4. **Pillar 4: Insignias & Tycoon Profile**:
     - Sovereign Executive Profile with complete financial breakdown.
     - The 5 Legendary Insignias (Rich Man at $1M, Investor at 100% stock buyout, Business Empire at $100T earnings, Monopoly at $500T, The Owner at $5,000T / $5 Quadrillion).
  5. **Interactive Tap to Earn ($1.00/tap)**:
     - Topbar and dashboard tap consoles for instant starting capital generation with audio effects and floating text.
- **Verification**: 28/28 Node.js unit tests passing (`tests/*.test.js`), verified via live browser subagent with zero console errors.

