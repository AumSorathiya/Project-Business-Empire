/* ==========================================================================
   Empire Architect: Upgrade Definitions
   Business-specific and operational upgrades per Architecture.md
   ========================================================================== */

export const UPGRADE_DEFINITIONS = [
  // Parcel Relay Upgrades
  {
    id: "route-optimization",
    businessId: "parcel-relay",
    name: "Route Optimization",
    description: "Algorithmic pathfinding increases Parcel Relay net income by +10% per level.",
    baseCost: 150,
    costGrowthRate: 1.6,
    effectPerLevel: 0.10,
    maxLevel: 25,
    unlockLevel: 1
  },
  {
    id: "automated-sorting",
    businessId: "parcel-relay",
    name: "Automated Sorting",
    description: "High-speed conveyor scanners boost Parcel Relay net income by +15% per level.",
    baseCost: 650,
    costGrowthRate: 1.7,
    effectPerLevel: 0.15,
    maxLevel: 20,
    unlockLevel: 1
  },

  // Corner Café Upgrades
  {
    id: "specialty-beans",
    businessId: "corner-cafe",
    name: "Specialty Micro-Roasts",
    description: "Single-origin beans increase Corner Café net income by +12% per level.",
    baseCost: 750,
    costGrowthRate: 1.6,
    effectPerLevel: 0.12,
    maxLevel: 25,
    unlockLevel: 2
  },
  {
    id: "patio-dining",
    businessId: "corner-cafe",
    name: "Expanded Seating",
    description: "All-weather covered terrace increases Corner Café net income by +18% per level.",
    baseCost: 3200,
    costGrowthRate: 1.7,
    effectPerLevel: 0.18,
    maxLevel: 20,
    unlockLevel: 2
  },

  // Pixel Foundry Upgrades
  {
    id: "rendering-pipeline",
    businessId: "pixel-foundry",
    name: "Neural Asset Pipeline",
    description: "Accelerated render pipelines increase Pixel Foundry net income by +12% per level.",
    baseCost: 3000,
    costGrowthRate: 1.6,
    effectPerLevel: 0.12,
    maxLevel: 25,
    unlockLevel: 3
  },
  {
    id: "cloud-render-farm",
    businessId: "pixel-foundry",
    name: "Cloud Render Clusters",
    description: "Distributed GPU nodes increase Pixel Foundry net income by +18% per level.",
    baseCost: 12000,
    costGrowthRate: 1.7,
    effectPerLevel: 0.18,
    maxLevel: 20,
    unlockLevel: 3
  },

  // GreenGrid Works Upgrades
  {
    id: "solid-state-cells",
    businessId: "greengrid-works",
    name: "Solid-State Storage",
    description: "Next-gen battery packs increase GreenGrid Works net income by +12% per level.",
    baseCost: 11000,
    costGrowthRate: 1.6,
    effectPerLevel: 0.12,
    maxLevel: 25,
    unlockLevel: 4
  },
  {
    id: "smart-grid-sync",
    businessId: "greengrid-works",
    name: "Smart Grid Synchronizers",
    description: "AI load balancing increases GreenGrid Works net income by +18% per level.",
    baseCost: 45000,
    costGrowthRate: 1.7,
    effectPerLevel: 0.18,
    maxLevel: 20,
    unlockLevel: 4
  },

  // Artisan Collective Upgrades
  {
    id: "master-guilds",
    businessId: "artisan-collective",
    name: "Guild Master Partnerships",
    description: "Master craftspeople increase Artisan Collective net income by +12% per level.",
    baseCost: 45000,
    costGrowthRate: 1.6,
    effectPerLevel: 0.12,
    maxLevel: 25,
    unlockLevel: 5
  },
  {
    id: "global-flagships",
    businessId: "artisan-collective",
    name: "Metropolitan Flagships",
    description: "Premier avenue showrooms increase Artisan Collective net income by +18% per level.",
    baseCost: 180000,
    costGrowthRate: 1.7,
    effectPerLevel: 0.18,
    maxLevel: 20,
    unlockLevel: 5
  },

  // Orbital Freight Upgrades
  {
    id: "reusable-thrusters",
    businessId: "orbital-freight",
    name: "Reusable Atmospheric Boosters",
    description: "Modular rocket recovery increases Orbital Freight net income by +12% per level.",
    baseCost: 190000,
    costGrowthRate: 1.6,
    effectPerLevel: 0.12,
    maxLevel: 25,
    unlockLevel: 6
  },
  {
    id: "cryo-depot",
    businessId: "orbital-freight",
    name: "Orbital Refueling Stations",
    description: "Low-Earth orbit depots increase Orbital Freight net income by +18% per level.",
    baseCost: 750000,
    costGrowthRate: 1.7,
    effectPerLevel: 0.18,
    maxLevel: 20,
    unlockLevel: 6
  },

  // Nova Materials Upgrades
  {
    id: "plasma-refining",
    businessId: "nova-materials",
    name: "Plasma Arc Furnaces",
    description: "High-temperature synthesis increases Nova Materials net income by +12% per level.",
    baseCost: 900000,
    costGrowthRate: 1.6,
    effectPerLevel: 0.12,
    maxLevel: 25,
    unlockLevel: 7
  },
  {
    id: "molecular-lattice",
    businessId: "nova-materials",
    name: "Zero-G Crystal Growth",
    description: "Flawless crystalline structures increase Nova Materials net income by +18% per level.",
    baseCost: 3500000,
    costGrowthRate: 1.7,
    effectPerLevel: 0.18,
    maxLevel: 20,
    unlockLevel: 7
  },

  // Horizon Systems Upgrades
  {
    id: "quantum-annealing",
    businessId: "horizon-systems",
    name: "Quantum Cryo-Cores",
    description: "Superconducting logic gates increase Horizon Systems net income by +12% per level.",
    baseCost: 4500000,
    costGrowthRate: 1.6,
    effectPerLevel: 0.12,
    maxLevel: 25,
    unlockLevel: 8
  },
  {
    id: "neural-mesh",
    businessId: "horizon-systems",
    name: "Autonomous Neural Mesh",
    description: "Self-evolving neural clusters increase Horizon Systems net income by +18% per level.",
    baseCost: 18000000,
    costGrowthRate: 1.7,
    effectPerLevel: 0.18,
    maxLevel: 20,
    unlockLevel: 8
  }
];

export const UPGRADE_MAP = new Map(UPGRADE_DEFINITIONS.map(u => [u.id, u]));
