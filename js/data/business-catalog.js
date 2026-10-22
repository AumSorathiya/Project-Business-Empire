/* ==========================================================================
   Business Empire: Business Catalog & Mergers Data
   12 Standard Industries + 4 Corporate Mergers
   ========================================================================== */

export const BUSINESS_TYPES = {
  RETAIL_STORE: "retail-store",
  RESTAURANT: "restaurant",
  TAXI_COMPANY: "taxi-company",
  SHIPPING_COMPANY: "shipping-company",
  CAR_DEALERSHIP: "car-dealership",
  CONSTRUCTION_COMPANY: "construction-company",
  FACTORY: "factory",
  BANK: "bank",
  IT_COMPANY: "it-company",
  FOOTBALL_CLUB: "football-club",
  AIRLINE: "airline",
  OIL_GAS: "oil-gas",
  // Mergers
  CLOTHING_BRAND: "clothing-brand",
  HOLDING_COMPANY: "holding-company",
  SPACE_AGENCY: "space-agency",
  BLOCKCHAIN_PLATFORM: "blockchain-platform"
};

export const MAX_BUSINESS_SLOTS = 21;

export const BUSINESS_CATALOG = [
  {
    id: BUSINESS_TYPES.RETAIL_STORE,
    name: "Retail Store",
    category: "Retail",
    cost: 2000,
    baseIncomePerHour: 150,
    maxLevel: 10,
    upgradeCostBase: 1200,
    upgradeCostMultiplier: 1.6,
    description: "Local convenience and retail shop. Scalable to Level 10. Required foundation for Clothing Brand.",
    icon: "store",
    image: "assets/businesses/artisan-collective.jpg",
    isMerger: false
  },
  {
    id: BUSINESS_TYPES.RESTAURANT,
    name: "Fine Dining Restaurant",
    category: "Hospitality",
    cost: 10000,
    baseIncomePerHour: 900,
    maxLevel: 15,
    upgradeCostBase: 5000,
    upgradeCostMultiplier: 1.5,
    description: "Premium gastronomic venue delivering steady passive hourly dining revenues.",
    icon: "utensils",
    image: "assets/businesses/corner-cafe.jpg",
    isMerger: false
  },
  {
    id: BUSINESS_TYPES.TAXI_COMPANY,
    name: "Metropolitan Taxi Co.",
    category: "Logistics",
    cost: 50000,
    baseIncomePerHour: 4500,
    maxLevel: 20,
    upgradeCostBase: 25000,
    upgradeCostMultiplier: 1.45,
    description: "Urban transportation network. Fleet scaling with Economy, Business, and Luxury cabs.",
    icon: "car",
    image: "assets/businesses/taxi-fleet.jpg",
    isMerger: false
  },
  {
    id: BUSINESS_TYPES.SHIPPING_COMPANY,
    name: "Global Freight & Cargo",
    category: "Logistics",
    cost: 250000,
    baseIncomePerHour: 22000,
    maxLevel: 25,
    upgradeCostBase: 100000,
    upgradeCostMultiplier: 1.4,
    description: "Intercity and international logistics. Fleet includes City Vans and Heavy Long-Haul Haulers.",
    icon: "truck",
    image: "assets/businesses/orbital-freight.jpg",
    isMerger: false
  },
  {
    id: BUSINESS_TYPES.CAR_DEALERSHIP,
    name: "Premier Car Dealership",
    category: "Automotive",
    cost: 500000,
    baseIncomePerHour: 55000,
    maxLevel: 20,
    upgradeCostBase: 250000,
    upgradeCostMultiplier: 1.4,
    description: "Showroom arbitrage. Inspect damaged auction vehicles, selectively repair components, and flip for profit.",
    icon: "tag",
    image: "assets/businesses/car-dealership.jpg",
    isMerger: false
  },
  {
    id: BUSINESS_TYPES.CONSTRUCTION_COMPANY,
    name: "Skyline Construction",
    category: "Industrial",
    cost: 1000000,
    baseIncomePerHour: 120000,
    maxLevel: 25,
    upgradeCostBase: 600000,
    upgradeCostMultiplier: 1.4,
    description: "Develops residential estates, commercial office hubs, and supertall skyscrapers.",
    icon: "hard-hat",
    image: "assets/illustrations/cityscape.jpg",
    isMerger: false
  },
  {
    id: BUSINESS_TYPES.FACTORY,
    name: "Automated Industrial Factory",
    category: "Manufacturing",
    cost: 2500000,
    baseIncomePerHour: 320000,
    maxLevel: 50,
    upgradeCostBase: 1500000,
    upgradeCostMultiplier: 1.35,
    description: "Advanced precision manufacturing plant. Scales to Level 50; foundational prerequisite for aerospace.",
    icon: "factory",
    image: "assets/businesses/nova-materials.jpg",
    isMerger: false
  },
  {
    id: BUSINESS_TYPES.BANK,
    name: "Commercial Reserve Bank",
    category: "Banking",
    cost: 10000000,
    baseIncomePerHour: 1500000,
    maxLevel: 30,
    upgradeCostBase: 8000000,
    upgradeCostMultiplier: 1.4,
    description: "Simulated financial institution. Tune Deposit Interest (e.g. 6.30%) and Credit Interest (e.g. 9.60%) across $420B vault capacity.",
    icon: "landmark",
    image: "assets/businesses/bank.jpg",
    isMerger: false,
    hasBankSliders: true
  },
  {
    id: BUSINESS_TYPES.IT_COMPANY,
    name: "Apex Software Studio",
    category: "Technology",
    cost: 25000000,
    baseIncomePerHour: 4200000,
    maxLevel: 20,
    upgradeCostBase: 18000000,
    upgradeCostMultiplier: 1.38,
    description: "Staff Devs, Designers, Testers, and a Team Leader to build massive software suites up to a $180B Operating System.",
    icon: "laptop-code",
    image: "assets/businesses/horizon-systems.jpg",
    isMerger: false,
    hasITStudio: true
  },
  {
    id: BUSINESS_TYPES.FOOTBALL_CLUB,
    name: "Imperial Football Club",
    category: "Sports",
    cost: 100000000,
    baseIncomePerHour: 18000000,
    maxLevel: 20,
    upgradeCostBase: 60000000,
    upgradeCostMultiplier: 1.35,
    description: "Elite sports club. Draft high-ranking players (rating up to 96+), expand arena, and win league sponsorships.",
    icon: "trophy",
    image: "assets/businesses/football-club.jpg",
    isMerger: false
  },
  {
    id: BUSINESS_TYPES.AIRLINE,
    name: "Trans-Continental Airlines",
    category: "Aviation",
    cost: 1000000000,
    baseIncomePerHour: 220000000,
    maxLevel: 25,
    upgradeCostBase: 800000000,
    upgradeCostMultiplier: 1.32,
    description: "Global aviation fleet. Acquire intercontinental hubs, optimize seat pricing, and sustain a 100% Load Factor.",
    icon: "plane",
    image: "assets/businesses/airline.jpg",
    isMerger: false
  },
  {
    id: BUSINESS_TYPES.OIL_GAS,
    name: "Apex Energy Corporation",
    category: "Energy",
    cost: 1500000000,
    baseIncomePerHour: 450000000,
    maxLevel: 62,
    upgradeCostBase: 1200000000,
    upgradeCostMultiplier: 1.28,
    description: "Late-game passive titan. Scale through 62 development tiers, offshore rigs, and LNG terminals for up to $13B/hour.",
    icon: "flame",
    image: "assets/businesses/oil-gas.jpg",
    isMerger: false
  },
  // Mergers
  {
    id: BUSINESS_TYPES.CLOTHING_BRAND,
    name: "Haute Couture Fashion Brand",
    category: "Conglomerate",
    cost: 3000000,
    baseIncomePerHour: 18000000,
    maxLevel: 20,
    upgradeCostBase: 5000000,
    upgradeCostMultiplier: 1.35,
    description: "Global luxury fashion empire. Formed by merging Retail Store (Lv 10) + Factory (Lv 20) + Shipping Fleet. Launch seasonal collections for peak margins.",
    icon: "shirt",
    image: "assets/businesses/clothing-brand.jpg",
    isMerger: true,
    requirements: {
      businessTypes: [
        { id: BUSINESS_TYPES.RETAIL_STORE, minLevel: 10 },
        { id: BUSINESS_TYPES.FACTORY, minLevel: 20 },
        { id: BUSINESS_TYPES.SHIPPING_COMPANY, minLevel: 1 }
      ],
      cashCost: 3000000
    }
  },
  {
    id: BUSINESS_TYPES.HOLDING_COMPANY,
    name: "Sovereign Holding Company",
    category: "Conglomerate",
    cost: 40000000000, // $40B in share capital
    baseIncomePerHour: 8700000000, // $8.7 Billion/hour
    maxLevel: 10,
    upgradeCostBase: 50000000000,
    upgradeCostMultiplier: 1.3,
    description: "Ultimate institutional vehicle. Formed by converting a maxed-out Bank with $420B vault and stock capital. Yields $8.7B/hour pure passive income.",
    icon: "briefcase",
    image: "assets/businesses/holding-company.jpg",
    isMerger: true,
    requirements: {
      businessTypes: [
        { id: BUSINESS_TYPES.BANK, minLevel: 30 }
      ],
      cashCost: 40000000000
    }
  },
  {
    id: BUSINESS_TYPES.SPACE_AGENCY,
    name: "Orbital Space Agency",
    category: "Aerospace",
    cost: 5000000,
    baseIncomePerHour: 4500000000,
    maxLevel: 15,
    upgradeCostBase: 10000000000,
    upgradeCostMultiplier: 1.35,
    description: "Private aerospace exploration. Requires Factory (Lv 50), Construction ($60M earnings), and Shipping Fleet. Launches orbital rockets & lunar landers.",
    icon: "rocket",
    image: "assets/businesses/space-agency.jpg",
    isMerger: true,
    requirements: {
      businessTypes: [
        { id: BUSINESS_TYPES.FACTORY, minLevel: 50 },
        { id: BUSINESS_TYPES.CONSTRUCTION_COMPANY, minLevel: 15 },
        { id: BUSINESS_TYPES.SHIPPING_COMPANY, minLevel: 10 }
      ],
      cashCost: 5000000
    }
  },
  {
    id: BUSINESS_TYPES.BLOCKCHAIN_PLATFORM,
    name: "Decentralized Blockchain Platform",
    category: "Fintech",
    cost: 1000000000,
    baseIncomePerHour: 2500000000,
    maxLevel: 15,
    upgradeCostBase: 5000000000,
    upgradeCostMultiplier: 1.35,
    description: "Next-gen distributed ledger network. Requires IT Company with $1B+ earnings and $1B+ Crypto portfolio.",
    icon: "link",
    image: "assets/businesses/greengrid-works.jpg",
    isMerger: true,
    requirements: {
      businessTypes: [
        { id: BUSINESS_TYPES.IT_COMPANY, minLevel: 10 }
      ],
      minCryptoPortfolioValue: 1000000000,
      cashCost: 1000000000
    }
  }
];

export const BUSINESS_CATALOG_MAP = new Map(BUSINESS_CATALOG.map(b => [b.id, b]));
