/**
 * A Quick function to sell off all stocks
 */

import { NS } from "@ns";

/** @param {NS} ns */
export async function main(ns: NS) {
  const allStocks = ns.stock.getSymbols();
  allStocks.forEach((stock) => {
    const stockData = ns.stock.getPosition(stock);
    ns.stock.sellStock(stock, stockData[0]);
  });
}
