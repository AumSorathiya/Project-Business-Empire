/* ==========================================================================
   Business Empire: Tap-to-Earn Progression & Booster Upgrades
   ========================================================================== */

export const TAP_UPGRADES = [
  {
    id: "tap-intern",
    name: "Wall Street Intern",
    cost: 50,
    costMultiplier: 1.5,
    tapPowerBonus: 1, // +$1 per tap
    autoTapsPerSec: 0,
    description: "Enthusiastic financial intern executing retail deal execution."
  },
  {
    id: "tap-bot",
    name: "High-Frequency Algorithmic Bot",
    cost: 450,
    costMultiplier: 1.6,
    tapPowerBonus: 0,
    autoTapsPerSec: 1, // 1 tap per sec passive
    description: "Automated execution script harvesting small market inefficiencies."
  },
  {
    id: "tap-broker",
    name: "Senior Equity Dealmaker",
    cost: 2500,
    costMultiplier: 1.65,
    tapPowerBonus: 10, // +$10 per tap
    autoTapsPerSec: 0,
    description: "Vetted investment banker closing bilateral private placements."
  },
  {
    id: "tap-server",
    name: "Co-Located Trading Server Rack",
    cost: 15000,
    costMultiplier: 1.7,
    tapPowerBonus: 0,
    autoTapsPerSec: 4, // 4 taps per sec passive
    description: "Microsecond fiber optic connection directly to exchange match engines."
  },
  {
    id: "tap-ai-quantum",
    name: "Quantum Arbitrage Neural AI",
    cost: 120000,
    costMultiplier: 1.75,
    tapPowerBonus: 100, // +$100 per tap
    autoTapsPerSec: 10, // 10 taps per sec passive
    description: "Autonomous self-optimizing syndicate liquidity provider."
  }
];

export const FORTUNE_WHEEL_SLICES = [
  { id: "slice-1", label: "$5,000 Cash", type: "cash", value: 5000, color: "#2563EB" },
  { id: "slice-2", label: "$25,000 Cash", type: "cash", value: 25000, color: "#059669" },
  { id: "slice-3", label: "+100 ACRO Shares", type: "stock", ticker: "ACRO", shares: 100, color: "#7C3AED" },
  { id: "slice-4", label: "0.25 BTC Bonus", type: "crypto", symbol: "BTG", amount: 0.25, color: "#F59E0B" },
  { id: "slice-5", label: "$100,000 Cash", type: "cash", value: 100000, color: "#10B981" },
  { id: "slice-6", label: "Free Hypercar!", type: "luxury", idItem: "lux-car-hyper", color: "#DC2626" },
  { id: "slice-7", label: "2.0x Gold Surge (5m)", type: "buff", durationSec: 300, multiplier: 2.0, color: "#EA580C" },
  { id: "slice-8", label: "★ $1,000,000 Jackpot!", type: "cash", value: 1000000, color: "#EAB308" }
];
