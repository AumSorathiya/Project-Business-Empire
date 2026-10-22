/* ==========================================================================
   Business Empire: Car Dealership Auction & Garage Data
   Buy salvage exotic cars, inspect defects, repair, and flip for profit
   ========================================================================== */

export const AUCTION_CARS = [
  {
    id: "auction-m4",
    name: "Veloce Sportline M4 (Damaged)",
    tier: "Sports Coupe",
    salvagePrice: 32000,
    repairCost: 14000,
    showroomResaleValue: 68000,
    profit: 22000,
    defects: ["Shattered Carbon Splitter", "Misfiring Turbocharger", "Scuffed Alloy Wheels"],
    image: "assets/luxury/car-m4.jpg"
  },
  {
    id: "auction-gt3",
    name: "Stuttgart GT3 RSR (Salvage)",
    tier: "Track Weapon",
    salvagePrice: 95000,
    repairCost: 42000,
    showroomResaleValue: 198000,
    profit: 61000,
    defects: ["Bent Ceramic Brakes", "Clutch Wear 85%", "Front Fascia Impact"],
    image: "assets/luxury/car-gt3.jpg"
  },
  {
    id: "auction-valkyrie",
    name: "Apex Valkyrie V12 (Barn Find)",
    tier: "Hypercar",
    salvagePrice: 750000,
    repairCost: 380000,
    showroomResaleValue: 1650000,
    profit: 520000,
    defects: ["Hybrid Battery Failure", "Carbon Monocoque Fracture", "ECU Firmware Lockout"],
    image: "assets/luxury/car-valkyrie.jpg"
  },
  {
    id: "auction-chiron",
    name: "Chiron Super Sport W16 (Insurance Write-off)",
    tier: "Megacar Sovereign",
    salvagePrice: 2200000,
    repairCost: 950000,
    showroomResaleValue: 4500000,
    profit: 1350000,
    defects: ["Quad-Turbo Ingestion", "Active Aero Hydraulic Leak", "Titanium Exhaust Melt"],
    image: "assets/luxury/car-chiron.jpg"
  }
];
