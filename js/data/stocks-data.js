/* ==========================================================================
   Business Empire: Stocks Market Data
   Equities, Dividend Yields, and Buyout Parameters
   ========================================================================== */

export const STOCK_DEFINITIONS = [
  {
    ticker: "ACRO",
    name: "Acro Technologies",
    sector: "Consumer Tech",
    basePrice: 185.50,
    minPrice: 120.00,
    maxPrice: 260.00,
    totalShares: 2000000,
    dividendYieldAnnual: 0.038, // 3.8% annual dividend yield
    volatility: 0.03,
    description: "Global mobile devices, hardware ecosystems, and silicon computing giant.",
    image: "assets/stocks/acro.svg"
  },
  {
    ticker: "QNTM",
    name: "Quantum Cloud Dynamics",
    sector: "Software",
    basePrice: 340.00,
    minPrice: 240.00,
    maxPrice: 480.00,
    totalShares: 1500000,
    dividendYieldAnnual: 0.029, // 2.9%
    volatility: 0.035,
    description: "Enterprise operating systems, hyperscale cloud data centers, and productivity suites.",
    image: "assets/stocks/qntm.svg"
  },
  {
    ticker: "HYPR",
    name: "Hyperion Autonomous",
    sector: "Clean Mobility",
    basePrice: 215.00,
    minPrice: 110.00,
    maxPrice: 380.00,
    totalShares: 3000000,
    dividendYieldAnnual: 0.015, // 1.5%
    volatility: 0.055,
    description: "Next-gen electric vehicles, neural autonomous driving, and grid batteries.",
    image: "assets/stocks/hypr.svg"
  },
  {
    ticker: "OMNI",
    name: "Omni Logistics Group",
    sector: "E-Commerce",
    basePrice: 145.20,
    minPrice: 95.00,
    maxPrice: 210.00,
    totalShares: 4000000,
    dividendYieldAnnual: 0.022, // 2.2%
    volatility: 0.04,
    description: "Omnichannel e-commerce marketplace and robotic global fulfillment infrastructure.",
    image: "assets/stocks/omni.svg"
  },
  {
    ticker: "TITN",
    name: "Titan Energy Resources",
    sector: "Energy",
    basePrice: 110.80,
    minPrice: 75.00,
    maxPrice: 160.00,
    totalShares: 5000000,
    dividendYieldAnnual: 0.058, // 5.8% high dividend
    volatility: 0.028,
    description: "Multinational energy exploration, refining, pipelines, and offshore platforms.",
    image: "assets/stocks/titn.svg"
  },
  {
    ticker: "VORT",
    name: "Vortex Semiconductor",
    sector: "Hardware",
    basePrice: 520.00,
    minPrice: 310.00,
    maxPrice: 790.00,
    totalShares: 1200000,
    dividendYieldAnnual: 0.018, // 1.8%
    volatility: 0.06,
    description: "Advanced lithography microprocessors, AI graphics accelerators, and foundry chips.",
    image: "assets/stocks/vort.svg"
  },
  {
    ticker: "AURA",
    name: "Aura BioPharma",
    sector: "Healthcare",
    basePrice: 88.50,
    minPrice: 55.00,
    maxPrice: 140.00,
    totalShares: 6000000,
    dividendYieldAnnual: 0.042, // 4.2%
    volatility: 0.032,
    description: "Global pharmaceutical research, oncology therapeutics, and medical biosensors.",
    image: "assets/stocks/aura.svg"
  },
  {
    ticker: "AERO",
    name: "AeroDynamics Defence",
    sector: "Aerospace",
    basePrice: 275.00,
    minPrice: 180.00,
    maxPrice: 390.00,
    totalShares: 2500000,
    dividendYieldAnnual: 0.035, // 3.5%
    volatility: 0.025,
    description: "Commercial aircraft carriers, supersonic turbines, and satellite constellations.",
    image: "assets/stocks/aero.svg"
  }
];

export const STOCK_MAP = new Map(STOCK_DEFINITIONS.map(s => [s.ticker, s]));
