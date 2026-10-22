/* ==========================================================================
   Business Empire: Real Estate Properties Data
   Passive Rental Yields, 5 Upgrade Tiers, and 12% Liquidation Tax
   ========================================================================== */

export const REAL_ESTATE_TAX_RATE = 0.12; // 12% sales tax on property liquidation

export const REAL_ESTATE_DEFINITIONS = [
  {
    id: "prop-lublin",
    name: "Lublin Residential Flat",
    location: "Lublin, Poland",
    baseCost: 45000,
    baseRentPerHour: 140,
    maxUpgradeLevel: 5,
    upgradeCostBase: 12000,
    description: "Well-maintained central apartment catering to university faculty and young professionals.",
    image: "assets/illustrations/cityscape.jpg"
  },
  {
    id: "prop-stavropol",
    name: "Stavropol Countryside Villa",
    location: "Stavropol, Russia",
    baseCost: 180000,
    baseRentPerHour: 520,
    maxUpgradeLevel: 5,
    upgradeCostBase: 45000,
    description: "Spacious suburban villa featuring orchard gardens and stable long-term tenancy.",
    image: "assets/businesses/artisan-collective.jpg"
  },
  {
    id: "prop-burlington",
    name: "Burlington Executive Duplex",
    location: "Burlington, Canada",
    baseCost: 650000,
    baseRentPerHour: 1850,
    maxUpgradeLevel: 5,
    upgradeCostBase: 160000,
    description: "Lakeview duplex with contemporary architectural finishes and high corporate executive demand.",
    image: "assets/realestate/waterfront.jpg"
  },
  {
    id: "prop-lyon",
    name: "Lyon Historic Townhouse",
    location: "Lyon, France",
    baseCost: 2200000,
    baseRentPerHour: 6200,
    maxUpgradeLevel: 5,
    upgradeCostBase: 550000,
    description: "Restored 19th-century limestone residence located steps from vibrant cultural boulevards.",
    image: "assets/businesses/corner-cafe.jpg"
  },
  {
    id: "prop-london",
    name: "Mayfair Luxury Penthouse",
    location: "London, United Kingdom",
    baseCost: 8500000,
    baseRentPerHour: 24000,
    maxUpgradeLevel: 5,
    upgradeCostBase: 2100000,
    description: "Ultra-prime duplex penthouse with panoramic skyline terraces and 24/7 private concierge.",
    image: "assets/realestate/penthouse.jpg"
  },
  {
    id: "prop-florida",
    name: "Palm Beach Waterfront Manor",
    location: "Florida, United States",
    baseCost: 28000000,
    baseRentPerHour: 78000,
    maxUpgradeLevel: 5,
    upgradeCostBase: 7000000,
    description: "Gated oceanfront compound with private deepwater yacht slip and tennis pavilion.",
    image: "assets/realestate/waterfront.jpg"
  },
  {
    id: "prop-tokyo",
    name: "Ginza Commercial Tower Floor",
    location: "Tokyo, Japan",
    baseCost: 95000000,
    baseRentPerHour: 260000,
    maxUpgradeLevel: 5,
    upgradeCostBase: 24000000,
    description: "Prime high-yield commercial floor occupied by international financial institutions.",
    image: "assets/illustrations/cityscape.jpg"
  },
  {
    id: "prop-monaco",
    name: "Monaco Royal Seaside Chateau",
    location: "Monaco, Monte Carlo",
    baseCost: 350000000,
    baseRentPerHour: 980000,
    maxUpgradeLevel: 5,
    upgradeCostBase: 88000000,
    description: "Sovereign Mediterranean clifftop estate overlooking the Formula 1 Grand Prix circuit.",
    image: "assets/luxury/private-island.jpg"
  },
  {
    id: "prop-dubai",
    name: "Burj Crown Sky Palace",
    location: "Dubai, United Arab Emirates",
    baseCost: 1200000000,
    baseRentPerHour: 3400000,
    maxUpgradeLevel: 5,
    upgradeCostBase: 300000000,
    description: "Monumental triplex penthouse atop the world's most recognizable luxury architectural marvel.",
    image: "assets/realestate/dubai-penthouse.jpg"
  }
];

export const REAL_ESTATE_MAP = new Map(REAL_ESTATE_DEFINITIONS.map(p => [p.id, p]));
