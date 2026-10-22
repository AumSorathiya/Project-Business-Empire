/* ==========================================================================
   Empire Architect: Achievement Catalog
   4 achievement groups per PRD specifications
   ========================================================================== */

export const ACHIEVEMENT_GROUPS = {
  FIRST_VENTURES: "First Ventures",
  FINANCIAL_DISCIPLINE: "Financial Discipline",
  PORTFOLIO_BUILDER: "Portfolio Builder",
  EMPIRE_MILESTONES: "Empire Milestones"
};

export const ACHIEVEMENTS = [
  // First Ventures
  {
    id: "first-venture",
    group: ACHIEVEMENT_GROUPS.FIRST_VENTURES,
    title: "First Step",
    description: "Purchase your first business enterprise.",
    rewardCredits: 50,
    check: (state, selectors) => selectors.getTotalBusinessesOwned(state) >= 1
  },
  {
    id: "first-upgrade",
    group: ACHIEVEMENT_GROUPS.FIRST_VENTURES,
    title: "Continuous Improvement",
    description: "Purchase your first business upgrade.",
    rewardCredits: 100,
    check: (state) => (state.statistics?.totalUpgrades || 0) >= 1
  },
  {
    id: "portfolio-trio",
    group: ACHIEVEMENT_GROUPS.FIRST_VENTURES,
    title: "Diversified Start",
    description: "Own at least 3 distinct business categories.",
    rewardCredits: 250,
    check: (state, selectors) => selectors.getDistinctBusinessesOwned(state) >= 3
  },
  {
    id: "ten-enterprises",
    group: ACHIEVEMENT_GROUPS.FIRST_VENTURES,
    title: "Rapid Expansion",
    description: "Own 10 total businesses across all sectors.",
    rewardCredits: 500,
    check: (state, selectors) => selectors.getTotalBusinessesOwned(state) >= 10
  },

  // Financial Discipline
  {
    id: "income-10",
    group: ACHIEVEMENT_GROUPS.FINANCIAL_DISCIPLINE,
    title: "Cash Flow Positive",
    description: "Generate at least 10 credits per second in net income.",
    rewardCredits: 200,
    check: (state, selectors) => selectors.getPortfolioNetIncomePerSecond(state) >= 10
  },
  {
    id: "income-100",
    group: ACHIEVEMENT_GROUPS.FINANCIAL_DISCIPLINE,
    title: "Revenue Milestone",
    description: "Generate at least 100 credits per second in net income.",
    rewardCredits: 1000,
    check: (state, selectors) => selectors.getPortfolioNetIncomePerSecond(state) >= 100
  },
  {
    id: "income-1000",
    group: ACHIEVEMENT_GROUPS.FINANCIAL_DISCIPLINE,
    title: "Commercial Force",
    description: "Generate at least 1,000 credits per second in net income.",
    rewardCredits: 5000,
    check: (state, selectors) => selectors.getPortfolioNetIncomePerSecond(state) >= 1000
  },
  {
    id: "lifetime-2k",
    group: ACHIEVEMENT_GROUPS.FINANCIAL_DISCIPLINE,
    title: "Break-Even Master",
    description: "Accumulate 2,000 credits in lifetime earnings.",
    rewardCredits: 400,
    check: (state) => state.lifetimeEarnings >= 2000
  },

  // Portfolio Builder
  {
    id: "fleet-manager",
    group: ACHIEVEMENT_GROUPS.PORTFOLIO_BUILDER,
    title: "Fleet Manager",
    description: "Own 25 Parcel Relays.",
    rewardCredits: 1500,
    check: (state, selectors) => selectors.getBusinessQuantity(state, "parcel-relay") >= 25
  },
  {
    id: "cafe-syndicate",
    group: ACHIEVEMENT_GROUPS.PORTFOLIO_BUILDER,
    title: "Hospitality Hub",
    description: "Own 25 Corner Cafés.",
    rewardCredits: 3000,
    check: (state, selectors) => selectors.getBusinessQuantity(state, "corner-cafe") >= 25
  },
  {
    id: "pixel-pioneer",
    group: ACHIEVEMENT_GROUPS.PORTFOLIO_BUILDER,
    title: "Tech Incubator",
    description: "Own 20 Pixel Foundries.",
    rewardCredits: 6000,
    check: (state, selectors) => selectors.getBusinessQuantity(state, "pixel-foundry") >= 20
  },
  {
    id: "clean-grid",
    group: ACHIEVEMENT_GROUPS.PORTFOLIO_BUILDER,
    title: "Clean Powerhouse",
    description: "Own 15 GreenGrid Works.",
    rewardCredits: 12000,
    check: (state, selectors) => selectors.getBusinessQuantity(state, "greengrid-works") >= 15
  },

  // Empire Milestones
  {
    id: "six-figure-net",
    group: ACHIEVEMENT_GROUPS.EMPIRE_MILESTONES,
    title: "Six-Figure Empire",
    description: "Achieve 100,000 credits in total Net Worth.",
    rewardCredits: 5000,
    check: (state, selectors) => selectors.getNetWorth(state) >= 100000
  },
  {
    id: "millionaire",
    group: ACHIEVEMENT_GROUPS.EMPIRE_MILESTONES,
    title: "Millionaire Architect",
    description: "Achieve 1,000,000 credits in total Net Worth.",
    rewardCredits: 25000,
    check: (state, selectors) => selectors.getNetWorth(state) >= 1000000
  },
  {
    id: "full-spectrum",
    group: ACHIEVEMENT_GROUPS.EMPIRE_MILESTONES,
    title: "Full Spectrum",
    description: "Unlock and operate at least 1 unit of all 8 business types.",
    rewardCredits: 50000,
    check: (state, selectors) => selectors.getDistinctBusinessesOwned(state) >= 8
  },
  {
    id: "billionaire",
    group: ACHIEVEMENT_GROUPS.EMPIRE_MILESTONES,
    title: "Billionaire Syndicate",
    description: "Achieve 1,000,000,000 credits in total Net Worth.",
    rewardCredits: 1000000,
    check: (state, selectors) => selectors.getNetWorth(state) >= 1000000000
  }
];

export const ACHIEVEMENT_MAP = new Map(ACHIEVEMENTS.map(a => [a.id, a]));
