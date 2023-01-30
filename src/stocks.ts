/**
 * stocks buys stocks based on the below parameters
 * @module stocks
 * @param maxSharePer - max share percentage to hit for that stock
 * @param stockBuyPer - Stock buy percentage
 * @param stockVolPer - stock volatility percentage
 * @param moneyKeep - money to keep
 * @param minSharePer - minimum amount of shares to buy
 * @remarks Built upon u/pwillia7 's stock script.
 * u/ferrus_aub stock script using simple portfolio algorithm.
 * The mentioned params above are all internal to the main function
 */

import { NS } from "@ns";

export function autocomplete(data: { flags: (arg0: string[][]) => unknown }) {
  return [data.flags([["keep"]])];
}

export async function main(ns: NS) {
  const data = ns.flags([["keep", 10000000000]]);
  const maxSharePer = 10.0;
  const stockBuyPer = 0.2;
  const stockVolPer = 0.02;
  const moneyKeep = data.keep as number;
  const minSharePer = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    ns.disableLog("ALL");
    const stocks = ns.stock.getSymbols().sort(function (a, b) {
      return ns.stock.getForecast(b) - ns.stock.getForecast(a);
    });
    for (const stock of stocks) {
      const position = ns.stock.getPosition(stock);
      if (position[0]) {
        ns.printf("Position: %s", stock);
        sellPositions(stock, position);
      }
      buyPositions(stock, position);
    }
    ns.print("Cycle Complete");
    await ns.sleep(1000);
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
    const playerMoney = ns.getServerMoneyAvailable("home");

    if (forecast >= stockBuyPer && volPer <= stockVolPer) {
      if (
        playerMoney - moneyKeep >
        ns.stock.getPurchaseCost(stock, minSharePer, "Long")
      ) {
        const shares = Math.min(
          (playerMoney - moneyKeep - 100000) / askPrice,
          maxShares
        );
        ns.stock.buyStock(stock, shares);
        ns.printf("Bought: %s", stock);
        ns.printf(
          "Forecast is %s shares: %d ask price: %s volatility: %s",
          ns.nFormat(forecast, "(0.0%)"),
          shares,
          ns.nFormat(askPrice, "($0.0a)"),
          ns.nFormat(volPer, "(0.0%)")
        );
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
      ns.stock.sellStock(stock, position[0]);
      ns.printf("Sold: %s", stock);
    }
  }
}
