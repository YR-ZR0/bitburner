import { formatMoney } from "common";
/**
 * stocks buys stocks based on the below parameters
 * @module stocks
 * @param maxSharePer - max share percentage to hit for that stock
 * @param stockBuyPer - Stock buy percentage
 * @param stockVolPer - stock volatility percentage
 * @param minSharePer - minimum amount of shares to buy
 * @remarks Built upon u/pwillia7 's stock script.
 * u/ferrus_aub stock script using simple portfolio algorithm.
 * The mentioned params above are all internal to the main function
 */

import { NS } from "@ns";
import { getBudget } from "./common";

const stockGains = new Map();
let total = 0;
let balance = 0;
let max = 0;
const commision = 100000;

function getStocks(ns: NS) {
  const allStocks = ns.stock.getSymbols();
  allStocks.forEach((stock) => {
    const stockData = ns.stock.getPosition(stock);
    const gain = ns.stock.getSaleGain(stock, stockData[0], "Long");
    if (stockData[0] != 0) {
      stockGains.set(stock, gain);
      total = total + gain;
    }
  });
}

function render(ns: NS) {
  ns.clearLog();
  const row = "%-5s | %-8s";
  ns.printf(row, "Stock", "Gain");
  stockGains.forEach((gain: number, stock: string) => {
    ns.printf(row, stock, ns.nFormat(gain, "$0.00a"));
  });
  ns.printf("Total Gains are: %s", ns.nFormat(total, "$0.00a"));
  ns.printf("Balance: %s", formatMoney(ns, balance));
}

export async function main(ns: NS) {
  const maxSharePer = 10.0;
  const stockBuyPer = 0.2;
  const stockVolPer = 0.02;
  const minSharePer = 1;
  ns.disableLog("ALL");
  balance = getBudget(ns, "stocks") as number;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    max = getBudget(ns, "stocks") as number;
    const stocks = ns.stock.getSymbols().sort(function (a, b) {
      return ns.stock.getForecast(b) - ns.stock.getForecast(a);
    });
    for (const stock of stocks) {
      const position = ns.stock.getPosition(stock);
      if (position[0]) {
        sellPositions(stock, position);
      }
      buyPositions(stock, position);
    }
    getStocks(ns);
    render(ns);
    await ns.sleep(1000);
    stockGains.clear();
    total = 0;
  }

  function deduct(price: number) {
    if (balance > 0) {
      balance = balance - price;
    }
  }
  function increment(sold: number) {
    if (balance < max) {
      balance = balance + sold;
    }

    if (sold > max) {
      balance = max;
    }
  }

  /**
   * buy a given stock
   * @param stock - Stock to buy
   * @param position - amount of stock to buy
   */
  function buyPositions(stock: string, position: number[]) {
    const maxShares = ns.stock.getMaxShares(stock) * maxSharePer - position[0];
    const askPrice = ns.stock.getAskPrice(stock);
    const forecast = ns.stock.getForecast(stock);
    const volPer = ns.stock.getVolatility(stock);

    if (forecast >= stockBuyPer && volPer <= stockVolPer) {
      if (balance > ns.stock.getPurchaseCost(stock, minSharePer, "Long")) {
        const shares = Math.min((balance - commision) / askPrice, maxShares);
        const bought = ns.stock.buyStock(stock, shares);
        deduct(bought + commision);
      }
    }
  }
  /**
   * Sell off a given stock
   * @param stock - Stock to buy
   * @param position - amount of stock to buy
   */
  function sellPositions(stock: string, position: number[]) {
    const forecast = ns.stock.getForecast(stock);
    if (forecast < 0.5) {
      const sold = ns.stock.sellStock(stock, position[0]);
      increment(sold - commision);
    }
  }
}
