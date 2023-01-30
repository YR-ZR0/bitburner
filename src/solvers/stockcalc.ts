import { NS } from "@ns";

function algorithmicStockTrader(inputValues: number[], tradeCount = 1) {
  function calculateProfit(values: number[], tradeCount = 1) {
    let maxProfit = 0;
    let buyAt = 0;
    let sellAt = 0;
    for (let i = 0; i < values.length - 1; i++) {
      const buyValue = values[i];
      for (let j = i + 1; j < values.length; j++) {
        const sellValue = values[j];
        if (sellValue > buyValue) {
          const profit =
            sellValue -
            buyValue +
            (tradeCount <= 1 || values.length - j <= 2
              ? 0
              : calculateProfit(values.slice(j + 1), tradeCount - 1).maxProfit);
          if (profit > maxProfit) {
            maxProfit = profit;
            buyAt = buyValue;
            sellAt = sellValue;
          }
        }
      }
    }
    return { maxProfit, buyAt, sellAt };
  }
  return calculateProfit(inputValues, tradeCount);
}

/** @param {NS} ns */
export async function main(ns: NS) {
  const ticker = [
    63, 82, 174, 124, 137, 134, 153, 138, 82, 197, 27, 140, 42, 49, 37, 25, 9,
    152, 23, 39, 187, 88, 109, 138, 108, 47, 108, 177, 106, 85, 10, 176, 57, 18,
    144, 51, 198, 41, 131, 145,
  ];
  const res = algorithmicStockTrader(ticker, 5);
  ns.tprint(res);
}
