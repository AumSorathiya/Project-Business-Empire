# Empire Architect

> A strategic idle business tycoon and empire simulation web game built with vanilla web technologies.

![Empire Architect Preview](assets/illustrations/preview.png)

## Overview

**Empire Architect** is an original browser-based single-player business simulation where players start as apprentice tycoons, acquire entry-level courier services, optimize operations with technological upgrades, unlock advanced industry sectors, and compound their wealth into a multi-sector commercial empire.

### Core Features

- **8 Original Fictional Enterprises**:
  - **Parcel Relay** (Logistics)
  - **Corner Café** (Hospitality)
  - **Pixel Foundry** (Technology)
  - **GreenGrid Works** (Infrastructure)
  - **Artisan Collective** (Consumer Goods)
  - **Orbital Freight** (Suborbital Logistics)
  - **Nova Materials** (Advanced Metallurgy)
  - **Horizon Systems** (Autonomous Cognitive Compute)
- **Centralized Deterministic Economy Engine**:
  - Exponential acquisition costs (`baseCost * growthRate ** ownedQuantity`)
  - Technological upgrade cost scaling and cumulative efficiency multipliers
  - Real-time payback time estimation (break-even analysis)
  - Net Worth calculation (`Liquid Cash + Portfolio Asset Equity`)
- **Idle & Offline Earnings**:
  - Time-based deterministic income simulation (independent of frame rates)
  - 8-hour capped offline revenue credited once upon return with detailed breakdown modal
- **Syndicate Milestones & Progression**:
  - 10 Empire Levels from *Apprentice Tycoon* to *Global Luminary*
  - 16 Achievements across 4 groups (*First Ventures*, *Financial Discipline*, *Portfolio Builder*, *Empire Milestones*)
- **Enterprise UI / UX**:
  - Premium midnight dark theme with restrained gold accents
  - Interactive financial dashboard, portfolio revenue breakdown bar charts, and optimal acquisition advisor
  - Full keyboard accessibility and responsive layout across desktop, tablet, and mobile
- **Robust Persistence**:
  - Versioned local storage save envelope with automatic backup fallback
  - Automatic throttled saves every 10 seconds and on window unload/visibility change
  - Safe reset confirmation dialog

---

## Technology Stack

- **Markup**: Semantic HTML5
- **Styling**: Vanilla CSS3 (Custom design system, CSS variables, flexbox, grid, media queries)
- **Logic**: Vanilla JavaScript with ES modules (`import`/`export`)
- **Visuals**: Original inline and modular SVG icon system
- **Storage**: Browser LocalStorage with schema versioning and backup redundancy
- **Testing**: Node.js native test runner (`node:test`, `node:assert/strict`)

---

## Directory Structure

```text
├── index.html                   # Main entry document
├── package.json                 # Project manifest and test runner
├── README.md                    # Documentation & deployment guide
├── LICENSE                      # MIT License
├── css/
│   ├── tokens.css               # Design tokens, color palette, typography
│   ├── reset.css                # CSS reset and reduced-motion rules
│   ├── layout.css               # App shell, navigation, header, modal styling
│   ├── components.css           # Buttons, cards, progress bars, toast notifications
│   ├── dashboard.css            # Dashboard metrics, breakdown bars, milestone banner
│   └── responsive.css           # Mobile & tablet responsive adaptations
├── js/
│   ├── main.js                  # Entry point bootstrapping GameController
│   ├── app/
│   │   ├── controller.js        # Central game loop, event coordinator
│   │   ├── actions.js           # Action dispatchers
│   │   └── selectors.js         # State derivation functions
│   ├── engine/
│   │   ├── economy.js           # Central economy formulas and payback calculation
│   │   ├── simulation.js        # Elapsed-time simulation engine
│   │   ├── purchases.js         # Atomic purchase transaction service
│   │   ├── upgrades.js          # Atomic upgrade transaction service
│   │   └── numbers.js           # Numeric formatting and clamps
│   ├── data/
│   │   ├── balance.js           # Balance constants (starting cash, offline cap)
│   │   ├── businesses.js        # 8 business catalog definitions
│   │   ├── upgrades.js          # 16 upgrade definitions
│   │   └── achievements.js      # 16 achievement catalog definitions
│   ├── progression/
│   │   ├── levels.js            # Empire level tiers and requirements
│   │   ├── unlocks.js           # Unlock evaluation logic
│   │   └── achievement-service.js # Centralized achievement evaluator
│   ├── persistence/
│   │   ├── save-manager.js      # LocalStorage save/load/reset manager
│   │   ├── migrations.js        # Schema migration and state sanitizer
│   │   └── offline-income.js    # Capped offline earnings service
│   ├── ui/
│   │   ├── dashboard.js         # Dashboard view
│   │   ├── business-cards.js    # Enterprises grid view
│   │   ├── upgrade-panel.js     # Technologies upgrade view
│   │   ├── achievement-panel.js # Milestones view
│   │   ├── statistics-panel.js  # Audit and statistics view
│   │   ├── settings.js          # Settings & reset view
│   │   ├── navigation.js        # Topbar & sidebar controller
│   │   ├── notifications.js     # Toast notification service
│   │   ├── modal.js             # Accessible modal manager
│   │   └── icons.js             # Reusable SVG icon dictionary
│   └── utils/
│       ├── formatting.js        # Currency, compact numbers, rates
│       ├── time.js              # Durations and payback time
│       └── validation.js        # Input validation
└── tests/
    ├── economy.test.js          # Formula validation
    ├── purchases.test.js        # Purchase transaction unit tests
    ├── upgrades.test.js         # Upgrade transaction unit tests
    ├── offline-income.test.js   # Offline cap and threshold unit tests
    ├── achievements.test.js     # Achievement idempotency unit tests
    ├── persistence.test.js      # Schema sanitization tests
    └── integration.test.js      # Full loop integration tests
```

---

## Quick Start (One-Click)

### Windows
- **One-Click Play**: Double-click `Play-Game.bat` (or `run.bat`).
  - Automatically starts the local server.
  - Automatically launches the game in your default browser at `http://localhost:8080`.
  - Supports automatic port conflict resolution (tries 8081, 8082, etc. if 8080 is occupied).
- **Desktop Shortcut**: Double-click `Create-Desktop-Shortcut.bat` to create an **Empire Architect** icon right on your Windows Desktop for 1-click access anytime.

### Command Line / Cross-Platform
```bash
npm start
```
Or directly with Node:
```bash
node server.js
```
Or using Python:
```bash
python -m http.server 8080
```
Then navigate to `http://localhost:8080` in your web browser.

---

## Running Automated Tests

The test suite runs using Node.js's native test runner (zero external dependencies required):

```bash
npm test
```

All 20 test cases verify:
- Business and upgrade acquisition cost scaling
- Cumulative upgrade multiplier calculations
- Payback period calculations
- Atomic purchase transactions with insufficient funds rejection
- Atomic upgrade transactions with max-level caps
- Capped 8-hour offline earnings and idempotent rewards
- State sanitization against corrupted save data
- End-to-end integration loop (starting capital -> purchases -> idle ticks -> upgrades -> level ups -> net worth)

---

## Deployment

### GitHub Pages
1. Push the repository to GitHub.
2. In your repository settings, go to **Pages**.
3. Under **Build and deployment**, select **Source: Deploy from a branch**.
4. Select the `main` branch and root `/` folder, then click **Save**.
5. The game will be deployed over HTTPS at your GitHub Pages URL.

### Vercel
1. Install the Vercel CLI or link the repository at [vercel.com](https://vercel.com).
2. Deploy the root directory with default static site settings (no build command needed).

---

## License

This project is licensed under the [MIT License](LICENSE).
