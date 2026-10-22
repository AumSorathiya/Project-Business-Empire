/* ==========================================================================
   Business Empire: Luxury Lifestyle & Trophy Assets Data
   High-Net-Worth Prestige Assets (Vehicles, Megayachts, Aircraft, Islands)
   ========================================================================== */

export const LUXURY_CATEGORIES = {
  VEHICLES: "vehicles",
  YACHTS: "yachts",
  AIRCRAFT: "aircraft",
  ISLANDS: "islands"
};

export const LUXURY_DEFINITIONS = [
  // 1. Vehicles
  {
    id: "lux-car-sedan",
    name: "Acro Executive Sedan",
    category: LUXURY_CATEGORIES.VEHICLES,
    cost: 45000,
    description: "Refined business saloon providing whisper-quiet daily executive transport.",
    icon: "car",
    image: "assets/luxury/sedan.jpg"
  },
  {
    id: "lux-car-gt",
    name: "Veloce GT Coupe",
    category: LUXURY_CATEGORIES.VEHICLES,
    cost: 285000,
    description: "Handcrafted twin-turbo grand tourer wrapped in aerodynamic carbon fiber.",
    icon: "car",
    image: "assets/luxury/car-m4.jpg"
  },
  {
    id: "lux-car-hyper",
    name: "Apex Valkyrie Hypercar",
    category: LUXURY_CATEGORIES.VEHICLES,
    cost: 3800000,
    description: "Track-born hybrid hypercar producing over 1,400 horsepower.",
    icon: "car",
    image: "assets/luxury/car-valkyrie.jpg"
  },
  {
    id: "lux-car-collector",
    name: "1962 Classic Royale Roadster",
    category: LUXURY_CATEGORIES.VEHICLES,
    cost: 28000000,
    description: "Invaluable concours-d'elegance collector masterpiece. Only 3 units ever crafted.",
    icon: "car",
    image: "assets/luxury/classic-roadster.jpg"
  },

  // 2. Megayachts
  {
    id: "lux-yacht-mundo",
    name: "MundoMarine 40M",
    category: LUXURY_CATEGORIES.YACHTS,
    cost: 20500000,
    description: "Tri-deck luxury yacht featuring an infinity pool and owner suite balcony.",
    icon: "anchor",
    image: "assets/luxury/megayacht.jpg"
  },
  {
    id: "lux-yacht-pelorius",
    name: "Pelorius 115M Superyacht",
    category: LUXURY_CATEGORIES.YACHTS,
    cost: 275000000,
    description: "Twin-helipad ocean vessel with dual submarine garages and cinema deck.",
    icon: "anchor",
    image: "assets/luxury/megayacht.jpg"
  },
  {
    id: "lux-yacht-oceanic",
    name: "Oceanic Sovereign 160M",
    category: LUXURY_CATEGORIES.YACHTS,
    cost: 1500000000,
    description: "Ice-class megayacht engineered for autonomous trans-global expeditions.",
    icon: "anchor",
    image: "assets/luxury/megayacht.jpg"
  },
  {
    id: "lux-yacht-garden",
    name: "The Garden (Megayacht Flagship)",
    category: LUXURY_CATEGORIES.YACHTS,
    cost: 45000000000, // $45 Billion peak yacht
    description: "The most legendary floating sovereign city in existence. Multi-level botanical biomes.",
    icon: "anchor",
    image: "assets/luxury/megayacht.jpg"
  },

  // 3. Aircraft
  {
    id: "lux-air-heli",
    name: "Eurocopter VIP Rotorcraft",
    category: LUXURY_CATEGORIES.AIRCRAFT,
    cost: 12000000,
    description: "Twin-turbine executive helicopter with sound-insulated leather salon.",
    icon: "send",
    image: "assets/luxury/private-jet.jpg"
  },
  {
    id: "lux-air-jet",
    name: "Celestial G800 Transcontinental Jet",
    category: LUXURY_CATEGORIES.AIRCRAFT,
    cost: 75000000,
    description: "Mach 0.925 intercontinental private jet connecting London to Tokyo nonstop.",
    icon: "plane",
    image: "assets/luxury/private-jet.jpg"
  },
  {
    id: "lux-air-carrier",
    name: "Sky Sovereign VIP 777 Flying Palace",
    category: LUXURY_CATEGORIES.AIRCRAFT,
    cost: 420000000,
    description: "Custom widebody palace with master staterooms, dining hall, and executive boardroom.",
    icon: "plane",
    image: "assets/luxury/private-jet.jpg"
  },

  // 4. Private Islands & Landmarks
  {
    id: "lux-isl-caribbean",
    name: "Emerald Reef Atoll",
    category: LUXURY_CATEGORIES.ISLANDS,
    cost: 95000000,
    description: "Private Caribbean tropical atoll with deepwater lagoon and solar microgrid.",
    icon: "sun",
    image: "assets/luxury/private-island.jpg"
  },
  {
    id: "lux-isl-mediterranean",
    name: "Capri Sovereign Archipelago",
    category: LUXURY_CATEGORIES.ISLANDS,
    cost: 650000000,
    description: "Secluded Mediterranean island chain boasting ancient citadel ruins and private harbor.",
    icon: "globe",
    image: "assets/luxury/private-island.jpg"
  },
  {
    id: "lux-isl-sanctuary",
    name: "Pacific Sovereign Biosphere Island",
    category: LUXURY_CATEGORIES.ISLANDS,
    cost: 5000000000,
    description: "Complete geo-engineered private island with private runway and luxury estate compound.",
    icon: "shield",
    image: "assets/luxury/private-island.jpg"
  }
];

export const LUXURY_MAP = new Map(LUXURY_DEFINITIONS.map(l => [l.id, l]));
