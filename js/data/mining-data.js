/* ==========================================================================
   Business Empire: Crypto Mining Hardware Catalog
   Signature mobile game mechanic: Rigs, ASICs, Hashrates, and Passive Crypto
   ========================================================================== */

export const MINING_HARDWARE = [
  {
    id: "rig-gtx",
    name: "GPU Entry Rig (GTX 1660 Ti × 6)",
    cost: 3200,
    hashrateFormatted: "180 MH/s",
    minedCryptoSymbol: "DOGE",
    minedAmountPerHour: 85, // 85 DOGE/hr
    powerCostPerHour: 5,
    description: "Budget home mining rig utilizing 6 energy-efficient consumer GPUs.",
    icon: "cpu",
    image: "assets/crypto/rig-gtx.jpg"
  },
  {
    id: "rig-rtx4090",
    name: "Enthusiast Mining Rack (RTX 4090 × 8)",
    cost: 26000,
    hashrateFormatted: "950 MH/s",
    minedCryptoSymbol: "ETH",
    minedAmountPerHour: 0.045, // 0.045 ETH/hr (~$155/hr)
    powerCostPerHour: 35,
    description: "High-density workstation rack with liquid-cooled flagship graphics accelerators.",
    icon: "server",
    image: "assets/crypto/rig-rtx4090.jpg"
  },
  {
    id: "rig-antminer",
    name: "Antminer S19 Pro ASIC Cluster (× 4)",
    cost: 140000,
    hashrateFormatted: "440 TH/s",
    minedCryptoSymbol: "BTG",
    minedAmountPerHour: 0.018, // 0.018 BTG/hr (~$1,155/hr)
    powerCostPerHour: 180,
    description: "Dedicated industrial SHA-256 application-specific silicon hardware.",
    icon: "zap",
    image: "assets/crypto/rig-antminer.jpg"
  },
  {
    id: "rig-cryo",
    name: "Sovereign Sub-Zero Cryo-Pod ASIC DataCenter",
    cost: 1800000,
    hashrateFormatted: "8.5 PH/s",
    minedCryptoSymbol: "BTG",
    minedAmountPerHour: 0.35, // 0.35 BTG/hr (~$22,470/hr)
    powerCostPerHour: 1200,
    description: "Submerged fluorochemical liquid-cooled containerized datacenter mining farm.",
    icon: "shield",
    image: "assets/crypto/rig-cryo.jpg"
  }
];

export const MINING_HARDWARE_MAP = new Map(MINING_HARDWARE.map(m => [m.id, m]));
