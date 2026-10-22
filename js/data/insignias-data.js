/* ==========================================================================
   Business Empire: Legendary Insignias (The 5 Milestone Trophies)
   Authoritative specifications for endgame prestige badges
   ========================================================================== */

export const INSIGNIA_DEFINITIONS = [
  {
    id: "insignia-rich-man",
    name: "Rich Man Insignia",
    tier: 1,
    targetFormatted: "$1,000,000 Net Worth",
    description: "Surpassed seven figures in personal wealth. Successfully escaped the bootstrapping phase.",
    checkUnlock: (state, netWorth) => netWorth >= 1000000,
    icon: "award",
    image: "assets/insignias/rich-man.svg"
  },
  {
    id: "insignia-investor",
    name: "Investor Insignia",
    tier: 2,
    targetFormatted: "100% Stock Market Buyout",
    description: "Acquired a controlling 100% buyout stake across every publicly traded corporation on the exchange.",
    checkUnlock: (state, netWorth, isFullStockBuyout) => Boolean(isFullStockBuyout),
    icon: "trending-up",
    image: "assets/insignias/investor.svg"
  },
  {
    id: "insignia-business-empire",
    name: "Business Empire Insignia",
    tier: 3,
    targetFormatted: "$100 Trillion Business Earnings",
    description: "Generated an astronomical $100 Trillion in cumulative commercial enterprise revenues.",
    checkUnlock: (state) => (state.businessEarningsLifetime || state.lifetimeEarnings || 0) >= 100000000000000,
    icon: "building",
    image: "assets/insignias/business-empire.svg"
  },
  {
    id: "insignia-monopoly",
    name: "Monopoly Insignia",
    tier: 4,
    targetFormatted: "$500 Trillion Net Worth",
    description: "Consolidated half a quadrillion dollars in corporate capital, megayachts, real estate, and equity holdings.",
    checkUnlock: (state, netWorth) => netWorth >= 500000000000000,
    icon: "crown",
    image: "assets/insignias/monopoly.svg"
  },
  {
    id: "insignia-the-owner",
    name: "The Owner Insignia",
    tier: 5,
    targetFormatted: "$5,000 Trillion ($5Q) Net Worth",
    description: "The absolute zenith of global wealth and industrial power. True financial sovereign of the planet.",
    checkUnlock: (state, netWorth) => netWorth >= 5000000000000000,
    icon: "shield",
    image: "assets/insignias/the-owner.svg"
  }
];

export const INSIGNIA_MAP = new Map(INSIGNIA_DEFINITIONS.map(i => [i.id, i]));
