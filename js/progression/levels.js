/* ==========================================================================
   Empire Architect: Progression & Level Definitions
   Centralized empire leveling requirements and milestones
   ========================================================================== */

export const EMPIRE_LEVELS = [
  {
    level: 1,
    title: "Apprentice Tycoon",
    requiredLifetimeEarnings: 0,
    requiredBusinessesOwned: 0,
    unlocks: ["parcel-relay"],
    description: "Beginning the venture with local parcel delivery operations."
  },
  {
    level: 2,
    title: "Local Operator",
    requiredLifetimeEarnings: 1000,
    requiredBusinessesOwned: 2,
    unlocks: ["corner-cafe"],
    description: "Expanding into high-traffic community hospitality."
  },
  {
    level: 3,
    title: "Startup Founder",
    requiredLifetimeEarnings: 6000,
    requiredBusinessesOwned: 5,
    unlocks: ["pixel-foundry"],
    description: "Capitalizing on scalable digital creative technology."
  },
  {
    level: 4,
    title: "Grid Architect",
    requiredLifetimeEarnings: 25000,
    requiredBusinessesOwned: 10,
    unlocks: ["greengrid-works"],
    description: "Developing modern renewable energy infrastructure."
  },
  {
    level: 5,
    title: "Syndicate Partner",
    requiredLifetimeEarnings: 120000,
    requiredBusinessesOwned: 18,
    unlocks: ["artisan-collective"],
    description: "Crafting curated luxury goods for discerning international markets."
  },
  {
    level: 6,
    title: "Logistics Mogul",
    requiredLifetimeEarnings: 600000,
    requiredBusinessesOwned: 28,
    unlocks: ["orbital-freight"],
    description: "Spearheading orbital cargo freight transit systems."
  },
  {
    level: 7,
    title: "Industrial Magnate",
    requiredLifetimeEarnings: 3000000,
    requiredBusinessesOwned: 40,
    unlocks: ["nova-materials"],
    description: "Pioneering synthesis of rare composite alloys."
  },
  {
    level: 8,
    title: "Empire Architect",
    requiredLifetimeEarnings: 15000000,
    requiredBusinessesOwned: 60,
    unlocks: ["horizon-systems"],
    description: "Deploying planetary cognitive compute networks."
  },
  {
    level: 9,
    title: "Sovereign Capitalist",
    requiredLifetimeEarnings: 75000000,
    requiredBusinessesOwned: 90,
    unlocks: [],
    description: "Consolidating commanding multi-sector market influence."
  },
  {
    level: 10,
    title: "Global Luminary",
    requiredLifetimeEarnings: 500000000,
    requiredBusinessesOwned: 130,
    unlocks: [],
    description: "An indelible titan of global commerce and technological supremacy."
  }
];

/**
 * Calculate the player's eligible empire level based on lifetime earnings and businesses owned.
 * @param {number} lifetimeEarnings
 * @param {number} totalBusinessesOwned
 * @returns {number}
 */
export function calculateEligibleEmpireLevel(lifetimeEarnings = 0, totalBusinessesOwned = 0) {
  let eligibleLevel = 1;
  for (const tier of EMPIRE_LEVELS) {
    if (lifetimeEarnings >= tier.requiredLifetimeEarnings &&
        totalBusinessesOwned >= tier.requiredBusinessesOwned) {
      eligibleLevel = tier.level;
    } else {
      break;
    }
  }
  return eligibleLevel;
}

/**
 * Get details for the next upcoming milestone tier
 * @param {number} currentLevel
 * @returns {object|null}
 */
export function getNextMilestone(currentLevel) {
  return EMPIRE_LEVELS.find(tier => tier.level === currentLevel + 1) || null;
}
