/* ==========================================================================
   Business Empire: Cryptocurrency Market Data
   Zero Dividends, High Beta Volatility, and Swing Trading
   ========================================================================== */

export const CRYPTO_DEFINITIONS = [
  {
    symbol: "BTG",
    name: "BitGold",
    basePrice: 64200.00,
    minPrice: 28000.00,
    maxPrice: 108000.00,
    volatility: 0.08,
    description: "The premier decentralized proof-of-work digital store of value.",
    image: "assets/crypto/btc.svg"
  },
  {
    symbol: "ETH",
    name: "Etherium Core",
    basePrice: 3450.00,
    minPrice: 1400.00,
    maxPrice: 6200.00,
    volatility: 0.10,
    description: "Smart contract platform powering decentralized applications and tokens.",
    image: "assets/crypto/eth.svg"
  },
  {
    symbol: "SOL",
    name: "Solara Network",
    basePrice: 145.00,
    minPrice: 42.00,
    maxPrice: 310.00,
    volatility: 0.14,
    description: "High-throughput, low-latency blockchain for ultra-fast transactions.",
    image: "assets/crypto/sol.svg"
  },
  {
    symbol: "DOGE",
    name: "DogeMoon Coin",
    basePrice: 0.165,
    minPrice: 0.035,
    maxPrice: 0.720,
    volatility: 0.22,
    description: "Meme-fueled cultural crypto phenomenon with massive speculative swings.",
    image: "assets/crypto/doge.svg"
  }
];

export const CRYPTO_MAP = new Map(CRYPTO_DEFINITIONS.map(c => [c.symbol, c]));
