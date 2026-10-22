# Empire Architect: Product Requirements Document

**Version:** 1.0  
**Platform:** Browser-based web game  
**Genre:** Idle business tycoon  
**Visual direction:** Premium dark dashboard with gold accents  
**Persistence:** Local browser saves, no mandatory account  
**Working title:** Empire Architect

## 1. Product vision

Empire Architect is an original single-player idle business simulation. Players start with limited capital, establish businesses, reinvest earnings, upgrade production, unlock new industries, and build a diversified empire.

The game should make progress satisfying without requiring constant clicking. Idle income supports the experience; investment choices and progression create the depth.

## 2. Product goals

- Let a new player make a meaningful first purchase within the first minute.
- Make income, costs, upgrade effects, and progress easy to understand.
- Support a complete loop of buying, earning, upgrading, unlocking, saving, leaving, and returning.
- Provide capped offline income.
- Keep the game playable without registration or a backend.
- Make the architecture easy to expand after version 1.0.

## 3. Target audience

Casual strategy players, incremental-game enthusiasts, simulation fans, and players who enjoy long-term progression.

## 4. Core gameplay loop

**Earn → Invest → Upgrade → Unlock → Diversify → Compound**

Players purchase businesses that generate passive income. They reinvest that income into more businesses and upgrades, unlock further categories, and complete achievements.

## 5. Version 1.0 scope

### Must have
- Responsive dashboard and navigation.
- Cash, net worth, lifetime earnings, income per second, and empire level.
- At least eight original business types.
- Business purchasing and ownership tracking.
- Upgrade purchasing and production multipliers.
- Deterministic idle income simulation.
- Capped offline earnings.
- Automatic, versioned local saves.
- Achievements and progression unlocks.
- Tutorial and contextual explanations.
- Settings, reset confirmation, and save error handling.
- Automated tests for financial rules and persistence.
- Static deployment over HTTPS.

### Explicitly out of scope
- Multiplayer and online leaderboards.
- AI rivals.
- Stock or cryptocurrency markets.
- Employee/payroll simulation.
- Real estate portfolio.
- Mergers and acquisitions.
- Live supply chains and evolving markets.
- Accounts and cloud sync.
- Real-money trading, payments, or gambling.

## 6. Starting experience

Suggested balance seeds, to be playtested:
- Starting cash: 1,000 credits.
- First business: approximately 250 credits.
- First business net income: approximately 2 credits per second.
- First upgrade: approximately 150 credits.
- Tutorial target: under 90 seconds.

The player should have enough cash for an immediate decision, but not enough to buy the entire early portfolio.

## 7. Business portfolio

| Business | Starting cost | Base net income/sec | Identity |
|---|---:|---:|---|
| Parcel Relay | 250 | 2 | Affordable entry business |
| Corner Café | 1,000 | 8 | Stable early expansion |
| Pixel Foundry | 4,000 | 25 | Scalable technology |
| GreenGrid Works | 15,000 | 90 | Infrastructure and growth |
| Artisan Collective | 60,000 | 300 | Premium consumer demand |
| Orbital Freight | 250,000 | 1,100 | High-capacity logistics |
| Nova Materials | 1,200,000 | 4,800 | Industrial scale |
| Horizon Systems | 6,000,000 | 22,000 | Late-game technology |

These are fictional starting values, not final balance commitments.

## 8. Progression and achievements

Empire level should be driven by a mix of lifetime earnings, ownership, and milestones, not cash alone.

Achievement groups:
- First Ventures: first purchase, first upgrade, own three businesses.
- Financial Discipline: reach income thresholds, recover an investment cost.
- Portfolio Builder: own businesses across categories, reach quantity goals.
- Empire Milestones: reach net-worth thresholds and unlock all starting businesses.

Achievements must be awarded only once. Rewards are optional and must be balanced.

## 9. User experience

Desktop layout:
- Sidebar: Dashboard, Businesses, Upgrades, Achievements, Statistics, Settings.
- Top bar: cash, net worth, net income/sec, empire level, save status.
- Main area: income overview, portfolio summary, business cards, next milestone, recent achievements, suggested investments.

Business cards show name, icon, quantity, purchase cost, income contribution, upgrade level, unlock status, and actions.

Mobile layout stacks cards and uses compact navigation without horizontal overflow.

## 10. Visual direction

Use deep charcoal or midnight navy backgrounds, layered dark surfaces, restrained gold accents, accessible green/red financial states, muted gray secondary text, and high-contrast off-white text.

Gold should emphasize value and important actions, not every element. Use original CSS/SVG visuals or properly licensed assets. Do not copy another game's exact UI, artwork, names, descriptions, or progression.

## 11. Success criteria

Version 1.0 is successful when a new player can start, purchase and upgrade businesses, earn income, unlock achievements, reload the browser, resume saved progress, receive capped offline income, and continue without data loss.

## 12. Definition of done

- Eight businesses can be unlocked and operated.
- Purchases and upgrades use centralized calculations.
- Income progresses without constant clicking.
- Offline earnings are capped and credited once.
- Achievements and progression work correctly.
- Saves survive reloads and browser restarts.
- Invalid saves fail safely.
- Interface is responsive and accessible.
- Critical economic and persistence tests pass.
- Production deployment passes a full smoke test.
- All content is original or properly licensed.
