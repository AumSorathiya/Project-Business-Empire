/* ==========================================================================
   Business Empire: Investments View (Stocks, Crypto, Real Estate)
   Equities with dividends, volatile crypto trading, and global real estate
   ========================================================================== */

import { STOCK_DEFINITIONS, STOCK_MAP } from "../data/stocks-data.js";
import { CRYPTO_DEFINITIONS, CRYPTO_MAP } from "../data/crypto-data.js";
import { REAL_ESTATE_DEFINITIONS, REAL_ESTATE_MAP, REAL_ESTATE_TAX_RATE } from "../data/real-estate-data.js";
import { MINING_HARDWARE, MINING_HARDWARE_MAP } from "../data/mining-data.js";
import { InteractiveEngine } from "../engine/interactive-engine.js";
import { MarketEngine } from "../engine/market-simulation.js";
import { formatCredits } from "../utils/formatting.js";
import { AudioSystem } from "./audio.js";

export class InvestmentsView {
  constructor(containerEl, callbacks = {}) {
    this.container = containerEl;
    this.callbacks = callbacks; // { onBuyStock, onSellStock, onBuyCrypto, onSellCrypto, onBuyProperty, onUpgradeProperty, onSellProperty }
    this.activeSubtab = "stocks"; // "stocks" | "crypto" | "realestate"
  }

  render(state) {
    if (!this.container || !state) return;

    MarketEngine.initMarketState(state);

    const stockDividendsHourly = MarketEngine.calculateStockDividendsPerHour(state);
    const cryptoTotalVal = MarketEngine.getCryptoPortfolioValue(state);
    const realEstateRentHourly = MarketEngine.calculateRealEstateRentPerHour(state);

    this.container.innerHTML = `
      <!-- Live Market Flash News Ticker -->
      <div class="market-news-ticker-bar">
        <span class="ticker-news-tag">BREAKING FLASH</span>
        <div class="ticker-news-text">
          ${InteractiveEngine.getMarketFlashNews()} • ${InteractiveEngine.getMarketFlashNews()} • ${InteractiveEngine.getMarketFlashNews()}
        </div>
      </div>

      <div class="be-subnav-bar">
        <div class="be-tabs">
          <button class="be-tab-btn ${this.activeSubtab === 'stocks' ? 'active' : ''}" data-subtab="stocks">
            📈 Stocks & Dividends
          </button>
          <button class="be-tab-btn ${this.activeSubtab === 'crypto' ? 'active' : ''}" data-subtab="crypto">
            ⚡ Cryptocurrency
          </button>
          <button class="be-tab-btn ${this.activeSubtab === 'mining' ? 'active' : ''}" data-subtab="mining">
            ⛏️ Crypto Mining Farm
          </button>
          <button class="be-tab-btn ${this.activeSubtab === 'realestate' ? 'active' : ''}" data-subtab="realestate">
            🏛️ Real Estate
          </button>
        </div>
      </div>

      <div class="be-investment-content">
        ${this.renderSubtab(state, stockDividendsHourly, cryptoTotalVal, realEstateRentHourly)}
      </div>
    `;

    this.attachEvents(state);
  }

  renderSubtab(state, stockDividendsHourly, cryptoTotalVal, realEstateRentHourly) {
    if (this.activeSubtab === "stocks") {
      return this.renderStocks(state, stockDividendsHourly);
    } else if (this.activeSubtab === "crypto") {
      return this.renderCrypto(state, cryptoTotalVal);
    } else if (this.activeSubtab === "mining") {
      return this.renderMiningFarm(state);
    } else if (this.activeSubtab === "realestate") {
      return this.renderRealEstate(state, realEstateRentHourly);
    }
  }

  renderStocks(state, dividendsHourly) {
    const isFullBuyout = MarketEngine.isFullStockBuyout(state);

    return `
      <div class="invest-banner">
        <div class="banner-stat">
          <span class="label">Hourly Stock Dividends</span>
          <span class="value income">+${formatCredits(dividendsHourly)}/hr</span>
        </div>
        <div class="banner-stat">
          <span class="label">Exchange Buyout Status</span>
          <span class="value ${isFullBuyout ? 'income' : ''}">
            ${isFullBuyout ? '★ 100% Exchange Monopoly' : 'Incomplete (Acquire 100% for Investor Insignia)'}
          </span>
        </div>
      </div>

      <div class="invest-grid">
        ${STOCK_DEFINITIONS.map(stock => {
          const currentPrice = state.stockPrices[stock.ticker] || stock.basePrice;
          const owned = state.stockPortfolio[stock.ticker] || 0;
          const buyoutPct = ((owned / stock.totalShares) * 100).toFixed(1);
          const canAfford1 = state.cash >= currentPrice;
          const canAfford10 = state.cash >= currentPrice * 10;
          const canAfford100 = state.cash >= currentPrice * 100;
          const maxSharesAffordable = Math.min(
            stock.totalShares - owned,
            Math.floor(state.cash / currentPrice)
          );

          return `
            <div class="be-card stock-card">
              <div class="be-card-header">
                <div style="display: flex; align-items: center; gap: 8px;">
                  ${stock.image ? `<img src="${stock.image}" alt="${stock.ticker}" class="stock-logo-img" />` : ''}
                  <div>
                    <span class="ticker-badge">${stock.ticker}</span>
                    <span class="stock-sector">${stock.sector}</span>
                  </div>
                </div>
                <div class="stock-price">$${currentPrice.toFixed(2)}</div>
              </div>
              <h3 class="be-card-title">${stock.name}</h3>
              <p class="be-card-desc">${stock.description}</p>

              <div class="be-card-metrics">
                <div class="metric-block">
                  <span class="m-label">Dividend Yield</span>
                  <span class="m-val income">${(stock.dividendYieldAnnual * 100).toFixed(1)}% / yr</span>
                </div>
                <div class="metric-block">
                  <span class="m-label">Shares Owned</span>
                  <span class="m-val">${owned.toLocaleString()} (${buyoutPct}%)</span>
                </div>
              </div>

              <div class="stock-trade-controls">
                <div class="trade-row">
                  <span class="trade-label">Buy Shares:</span>
                  <button class="btn btn-sm btn-primary btn-buy-stock" data-ticker="${stock.ticker}" data-count="1" ${canAfford1 ? '' : 'disabled'}>+1</button>
                  <button class="btn btn-sm btn-primary btn-buy-stock" data-ticker="${stock.ticker}" data-count="10" ${canAfford10 ? '' : 'disabled'}>+10</button>
                  <button class="btn btn-sm btn-primary btn-buy-stock" data-ticker="${stock.ticker}" data-count="100" ${canAfford100 ? '' : 'disabled'}>+100</button>
                  <button class="btn btn-sm btn-gold btn-buy-stock" data-ticker="${stock.ticker}" data-count="${maxSharesAffordable}" ${maxSharesAffordable > 0 ? '' : 'disabled'}>Max</button>
                </div>
                ${owned > 0 ? `
                  <div class="trade-row" style="margin-top: 0.5rem;">
                    <span class="trade-label">Sell Shares:</span>
                    <button class="btn btn-sm btn-secondary btn-sell-stock" data-ticker="${stock.ticker}" data-count="1">-1</button>
                    <button class="btn btn-sm btn-secondary btn-sell-stock" data-ticker="${stock.ticker}" data-count="10" ${owned >= 10 ? '' : 'disabled'}>-10</button>
                    <button class="btn btn-sm btn-secondary btn-sell-stock" data-ticker="${stock.ticker}" data-count="100" ${owned >= 100 ? '' : 'disabled'}>-100</button>
                    <button class="btn btn-sm btn-secondary btn-sell-stock" data-ticker="${stock.ticker}" data-count="${owned}">All</button>
                  </div>
                ` : ''}
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  renderCrypto(state, cryptoTotalVal) {
    return `
      <div class="invest-banner">
        <div class="banner-stat">
          <span class="label">Total Crypto Portfolio Valuation</span>
          <span class="value income">${formatCredits(cryptoTotalVal)}</span>
        </div>
        <div class="banner-stat">
          <span class="label">Market Volatility</span>
          <span class="value" style="color: var(--color-gold);">High-Beta Active Trading (No Dividends)</span>
        </div>
      </div>

      <div class="invest-grid">
        ${CRYPTO_DEFINITIONS.map(crypto => {
          const currentPrice = state.cryptoPrices[crypto.symbol] || crypto.basePrice;
          const owned = state.cryptoPortfolio[crypto.symbol] || 0;
          const totalCoinValue = owned * currentPrice;
          const displayPrice = currentPrice < 1 ? currentPrice.toFixed(4) : currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

          return `
            <div class="be-card crypto-card">
              <div class="be-card-header">
                <div style="display: flex; align-items: center; gap: 8px;">
                  ${crypto.image ? `<img src="${crypto.image}" alt="${crypto.symbol}" class="crypto-icon-img" />` : ''}
                  <div>
                    <span class="ticker-badge crypto">${crypto.symbol}</span>
                    <span class="stock-sector">${crypto.name}</span>
                  </div>
                </div>
                <div class="stock-price crypto-price">$${displayPrice}</div>
              </div>
              <p class="be-card-desc">${crypto.description}</p>

              <div class="be-card-metrics">
                <div class="metric-block">
                  <span class="m-label">Held Balance</span>
                  <span class="m-val">${owned.toFixed(4)} ${crypto.symbol}</span>
                </div>
                <div class="metric-block">
                  <span class="m-label">Holding Valuation</span>
                  <span class="m-val income">${formatCredits(totalCoinValue)}</span>
                </div>
              </div>

              <div class="stock-trade-controls">
                <div class="trade-row">
                  <span class="trade-label">Buy with Cash:</span>
                  <button class="btn btn-sm btn-primary btn-buy-crypto" data-symbol="${crypto.symbol}" data-amount="1000" ${state.cash >= 1000 ? '' : 'disabled'}>$1K</button>
                  <button class="btn btn-sm btn-primary btn-buy-crypto" data-symbol="${crypto.symbol}" data-amount="10000" ${state.cash >= 10000 ? '' : 'disabled'}>$10K</button>
                  <button class="btn btn-sm btn-primary btn-buy-crypto" data-symbol="${crypto.symbol}" data-amount="100000" ${state.cash >= 100000 ? '' : 'disabled'}>$100K</button>
                  <button class="btn btn-sm btn-gold btn-buy-crypto" data-symbol="${crypto.symbol}" data-amount="${Math.floor(state.cash)}" ${state.cash > 0 ? '' : 'disabled'}>Max</button>
                </div>
                ${owned > 0 ? `
                  <div class="trade-row" style="margin-top: 0.5rem;">
                    <span class="trade-label">Sell Coins:</span>
                    <button class="btn btn-sm btn-secondary btn-sell-crypto" data-symbol="${crypto.symbol}" data-pct="0.25">25%</button>
                    <button class="btn btn-sm btn-secondary btn-sell-crypto" data-symbol="${crypto.symbol}" data-pct="0.50">50%</button>
                    <button class="btn btn-sm btn-secondary btn-sell-crypto" data-symbol="${crypto.symbol}" data-pct="1.0">100%</button>
                  </div>
                ` : ''}
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  renderRealEstate(state, rentHourly) {
    return `
      <div class="invest-banner">
        <div class="banner-stat">
          <span class="label">Total Passive Rental Yield</span>
          <span class="value income">+${formatCredits(rentHourly)}/hr</span>
        </div>
        <div class="banner-stat">
          <span class="label">Liquidation Policy</span>
          <span class="value">100% Market Value (minus 12% Sales Tax)</span>
        </div>
      </div>

      <div class="invest-grid">
        ${REAL_ESTATE_DEFINITIONS.map(prop => {
          const currentLevel = state.ownedProperties[prop.id] || 0;
          const isOwned = currentLevel > 0;
          const isMax = currentLevel >= prop.maxUpgradeLevel;
          const canAffordBuy = state.cash >= prop.baseCost;
          const nextUpgradeCost = isOwned && !isMax
            ? Math.floor(prop.upgradeCostBase * Math.pow(1.3, currentLevel - 1))
            : 0;
          const canAffordUpgrade = isOwned && !isMax && state.cash >= nextUpgradeCost;
          const currentRent = isOwned
            ? Math.floor(prop.baseRentPerHour * (1 + (currentLevel - 1) * 0.35))
            : prop.baseRentPerHour;

          return `
            <div class="be-card prop-card ${isOwned ? 'prop-owned' : ''}">
              ${prop.image ? `
                <div class="be-card-banner prop-banner">
                  <img src="${prop.image}" alt="${prop.name}" loading="lazy" />
                  <div class="be-banner-overlay"></div>
                </div>
              ` : ''}
              <div class="be-card-header">
                <div>
                  <span class="ticker-badge gold">${prop.location}</span>
                </div>
                <div class="be-card-level">
                  ${isOwned ? `Tier ${currentLevel} / ${prop.maxUpgradeLevel}` : 'Available'}
                </div>
              </div>
              <h3 class="be-card-title">${prop.name}</h3>
              <p class="be-card-desc">${prop.description}</p>

              <div class="be-card-metrics">
                <div class="metric-block">
                  <span class="m-label">${isOwned ? 'Current Rent' : 'Base Rent'}</span>
                  <span class="m-val income">+${formatCredits(currentRent)}/hr</span>
                </div>
                <div class="metric-block">
                  <span class="m-label">Asset Valuation</span>
                  <span class="m-val">${formatCredits(prop.baseCost)}</span>
                </div>
              </div>

              <div class="be-card-actions">
                ${!isOwned ? `
                  <button class="btn btn-gold btn-buy-prop ${canAffordBuy ? '' : 'btn-disabled'}"
                          data-prop-id="${prop.id}" ${canAffordBuy ? '' : 'disabled'}>
                    Acquire Property (${formatCredits(prop.baseCost)})
                  </button>
                ` : `
                  ${!isMax ? `
                    <button class="btn btn-primary btn-upgrade-prop ${canAffordUpgrade ? '' : 'btn-disabled'}"
                            data-prop-id="${prop.id}" ${canAffordUpgrade ? '' : 'disabled'}>
                      Upgrade Luxury (${formatCredits(nextUpgradeCost)})
                    </button>
                  ` : `
                    <button class="btn btn-gold btn-disabled" disabled>Max Luxury Tier (5/5)</button>
                  `}
                  <button class="btn btn-secondary btn-sell-prop" data-prop-id="${prop.id}">
                    Liquidate (-12% Tax)
                  </button>
                `}
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  renderMiningFarm(state) {
    InteractiveEngine.initInteractiveState(state);
    const ownedRigs = state.miningFarm.ownedRigs || {};
    let totalRigsCount = 0;
    let hourlyPower = 0;

    for (const [rigId, count] of Object.entries(ownedRigs)) {
      totalRigsCount += count;
      const r = MINING_HARDWARE_MAP.get(rigId);
      if (r) hourlyPower += r.powerCostPerHour * count;
    }

    return `
      <div class="invest-banner">
        <div class="banner-stat">
          <span class="label">Mining Rigs Active</span>
          <span class="value income">${totalRigsCount} Hardware Units</span>
        </div>
        <div class="banner-stat">
          <span class="label">Total Mined Crypto Value</span>
          <span class="value income">+${formatCredits(state.miningFarm.totalMinedValue || 0)}</span>
        </div>
        <div class="banner-stat">
          <span class="label">Hourly Datacenter Power</span>
          <span class="value" style="color: var(--color-negative);">-${formatCredits(hourlyPower)}/hr</span>
        </div>
      </div>

      <div class="mining-rigs-grid">
        ${MINING_HARDWARE.map(rig => {
          const owned = ownedRigs[rig.id] || 0;
          const canAfford = state.cash >= rig.cost;

          return `
            <div class="be-card stock-card">
              ${rig.image ? `
                <div class="be-card-banner" style="position: relative; overflow: hidden; border-radius: var(--radius-sm) var(--radius-sm) 0 0; margin: -16px -16px 12px -16px;">
                  <img src="${rig.image}" alt="${rig.name}" loading="lazy" style="width: 100%; height: 130px; object-fit: cover; display: block;" />
                  <div style="position: absolute; inset: 0; background: linear-gradient(180deg, transparent 40%, rgba(12, 17, 30, 0.95) 100%);"></div>
                </div>
              ` : ''}
              <div class="be-card-header">
                <div>
                  <span class="ticker-badge" style="background: rgba(212, 175, 55, 0.2); color: var(--color-gold);">${rig.hashrateFormatted}</span>
                  <span class="stock-sector">Mines: ${rig.minedCryptoSymbol}</span>
                </div>
                <div style="font-size: var(--font-size-xs); color: var(--color-gold); font-weight: bold;">
                  ${owned} Owned
                </div>
              </div>

              <h3 class="be-card-title" style="margin-top: 6px;">${rig.name}</h3>
              <p class="be-card-desc">${rig.description}</p>

              <div class="be-card-metrics">
                <div class="metric-block">
                  <span class="m-label">Hourly Yield</span>
                  <span class="m-val income">+${rig.minedAmountPerHour} ${rig.minedCryptoSymbol}/hr</span>
                </div>
                <div class="metric-block">
                  <span class="m-label">Power Cost</span>
                  <span class="m-val" style="color: var(--color-negative);">-${formatCredits(rig.powerCostPerHour)}/hr</span>
                </div>
              </div>

              <div class="be-card-actions" style="margin-top: 14px;">
                <button class="btn btn-gold btn-buy-mining-rig ${canAfford ? '' : 'btn-disabled'}" data-rig-id="${rig.id}" ${canAfford ? '' : 'disabled'}>
                  Acquire Hardware (${formatCredits(rig.cost)})
                </button>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  attachEvents(state) {
    // Sub-tab toggling
    this.container.querySelectorAll(".be-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.activeSubtab = btn.dataset.subtab;
        AudioSystem.playClick();
        this.render(state);
      });
    });

    // Buy mining rig
    this.container.querySelectorAll(".btn-buy-mining-rig").forEach(btn => {
      btn.addEventListener("click", () => {
        const rigId = btn.dataset.rigId;
        if (InteractiveEngine.buyMiningRig(state, rigId)) {
          AudioSystem.playPurchase();
          this.render(state);
          if (this.callbacks.onStateChanged) this.callbacks.onStateChanged();
        }
      });
    });

    // Stock Buy/Sell
    this.container.querySelectorAll(".btn-buy-stock").forEach(btn => {
      btn.addEventListener("click", () => {
        const ticker = btn.dataset.ticker;
        const count = parseInt(btn.dataset.count, 10);
        if (this.callbacks.onBuyStock) this.callbacks.onBuyStock(ticker, count);
      });
    });

    this.container.querySelectorAll(".btn-sell-stock").forEach(btn => {
      btn.addEventListener("click", () => {
        const ticker = btn.dataset.ticker;
        const count = parseInt(btn.dataset.count, 10);
        if (this.callbacks.onSellStock) this.callbacks.onSellStock(ticker, count);
      });
    });

    // Crypto Buy/Sell
    this.container.querySelectorAll(".btn-buy-crypto").forEach(btn => {
      btn.addEventListener("click", () => {
        const symbol = btn.dataset.symbol;
        const amount = parseFloat(btn.dataset.amount);
        if (this.callbacks.onBuyCrypto) this.callbacks.onBuyCrypto(symbol, amount);
      });
    });

    this.container.querySelectorAll(".btn-sell-crypto").forEach(btn => {
      btn.addEventListener("click", () => {
        const symbol = btn.dataset.symbol;
        const pct = parseFloat(btn.dataset.pct);
        if (this.callbacks.onSellCrypto) this.callbacks.onSellCrypto(symbol, pct);
      });
    });

    // Real Estate Buy/Upgrade/Sell
    this.container.querySelectorAll(".btn-buy-prop").forEach(btn => {
      btn.addEventListener("click", () => {
        const propId = btn.dataset.propId;
        if (this.callbacks.onBuyProperty) this.callbacks.onBuyProperty(propId);
      });
    });

    this.container.querySelectorAll(".btn-upgrade-prop").forEach(btn => {
      btn.addEventListener("click", () => {
        const propId = btn.dataset.propId;
        if (this.callbacks.onUpgradeProperty) this.callbacks.onUpgradeProperty(propId);
      });
    });

    this.container.querySelectorAll(".btn-sell-prop").forEach(btn => {
      btn.addEventListener("click", () => {
        const propId = btn.dataset.propId;
        if (this.callbacks.onSellProperty) this.callbacks.onSellProperty(propId);
      });
    });
  }
}
