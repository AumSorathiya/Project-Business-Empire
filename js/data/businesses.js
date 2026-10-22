/* ==========================================================================
   Empire Architect: Business Definitions
   8 original fictional businesses with custom artwork per blueprint specifications
   ========================================================================== */

export const BUSINESS_DEFINITIONS = [
  {
    id: "parcel-relay",
    name: "Parcel Relay",
    category: "Logistics",
    baseCost: 250,
    costGrowthRate: 1.15,
    baseNetIncomePerSecond: 2,
    unlock: {
      minimumLevel: 1,
      cost: 0,
      description: "Unlocked at Empire Level 1"
    },
    icon: "parcel",
    image: "assets/businesses/parcel-relay.jpg",
    description: "Affordable local courier routing and parcel fulfillment hubs."
  },
  {
    id: "corner-cafe",
    name: "Corner Café",
    category: "Hospitality",
    baseCost: 1000,
    costGrowthRate: 1.14,
    baseNetIncomePerSecond: 8,
    unlock: {
      minimumLevel: 2,
      cost: 0,
      description: "Unlocked at Empire Level 2"
    },
    icon: "cafe",
    image: "assets/businesses/corner-cafe.jpg",
    description: "Bustling neighbourhood espresso bars and artisan bakeries."
  },
  {
    id: "pixel-foundry",
    name: "Pixel Foundry",
    category: "Technology",
    baseCost: 4000,
    costGrowthRate: 1.13,
    baseNetIncomePerSecond: 25,
    unlock: {
      minimumLevel: 3,
      cost: 0,
      description: "Unlocked at Empire Level 3"
    },
    icon: "pixel",
    image: "assets/businesses/pixel-foundry.jpg",
    description: "Boutique digital studio crafting scalable software assets."
  },
  {
    id: "greengrid-works",
    name: "GreenGrid Works",
    category: "Infrastructure",
    baseCost: 15000,
    costGrowthRate: 1.12,
    baseNetIncomePerSecond: 90,
    unlock: {
      minimumLevel: 4,
      cost: 0,
      description: "Unlocked at Empire Level 4"
    },
    icon: "energy",
    image: "assets/businesses/greengrid-works.jpg",
    description: "Decentralized clean energy micro-grids and battery storage."
  },
  {
    id: "artisan-collective",
    name: "Artisan Collective",
    category: "Consumer Goods",
    baseCost: 60000,
    costGrowthRate: 1.12,
    baseNetIncomePerSecond: 300,
    unlock: {
      minimumLevel: 5,
      cost: 0,
      description: "Unlocked at Empire Level 5"
    },
    icon: "artisan",
    image: "assets/businesses/artisan-collective.jpg",
    description: "Curated workshops producing high-margin luxury goods."
  },
  {
    id: "orbital-freight",
    name: "Orbital Freight",
    category: "Logistics",
    baseCost: 250000,
    costGrowthRate: 1.11,
    baseNetIncomePerSecond: 1100,
    unlock: {
      minimumLevel: 6,
      cost: 0,
      description: "Unlocked at Empire Level 6"
    },
    icon: "freight",
    image: "assets/businesses/orbital-freight.jpg",
    description: "Heavy-payload suborbital cargo transit network."
  },
  {
    id: "nova-materials",
    name: "Nova Materials",
    category: "Industrial",
    baseCost: 1200000,
    costGrowthRate: 1.10,
    baseNetIncomePerSecond: 4800,
    unlock: {
      minimumLevel: 7,
      cost: 0,
      description: "Unlocked at Empire Level 7"
    },
    icon: "materials",
    image: "assets/businesses/nova-materials.jpg",
    description: "Advanced composite alloy synthesis and rare metal refining."
  },
  {
    id: "horizon-systems",
    name: "Horizon Systems",
    category: "Technology",
    baseCost: 6000000,
    costGrowthRate: 1.09,
    baseNetIncomePerSecond: 22000,
    unlock: {
      minimumLevel: 8,
      cost: 0,
      description: "Unlocked at Empire Level 8"
    },
    icon: "horizon",
    image: "assets/businesses/horizon-systems.jpg",
    description: "Cutting-edge autonomous cognitive compute infrastructure."
  }
];

export const BUSINESS_MAP = new Map(BUSINESS_DEFINITIONS.map(b => [b.id, b]));
