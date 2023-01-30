/**
 * Broker helps you keep an eye on your investments and total gains. this complements
 * @module
 */

import { NS } from "@ns";

const stockGains = new Map();
let total = 0;

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
}
/** @param {NS} ns */
export async function main(ns: NS) {
  ns.tail();
  ns.disableLog("ALL");
  // eslint-disable-next-line no-constant-condition
  while (true) {
    getStocks(ns);
    render(ns);
    await ns.sleep(200);
    stockGains.clear();
    total = 0;
  }
}
