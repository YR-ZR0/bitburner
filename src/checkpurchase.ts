/**
 * checkPurchase lets to figure out the max amount of servers you can buy from each class based on current money
 * @module checkPurchase
 *
 */

import { NS } from "@ns";
import { formatMoney } from "./common";

async function build(ns: NS) {
  const max = ns.getPurchasedServerMaxRam();
  let i = 1;
  let result = 0;
  const serverList = new Map<number, number>();
  do {
    result = Math.pow(2, i);
    const cost = ns.getPurchasedServerCost(result);
    serverList.set(result, cost);
    i++;
  } while (result < max);
  return serverList;
}

/** @param {NS} ns */
export async function main(ns: NS) {
  const currentMoney = ns.getPlayer().money;
  const calculated = await build(ns);
  // ns.tprint(calculated.values());
  calculated.forEach((cost: number, ram: number) => {
    if (currentMoney / cost >= 1) {
      ns.tprintf(
        "Ram %s (%s) can be bought %d times with cost %s",
        ns.formatRam(ram),
        ram,
        currentMoney / cost,
        formatMoney(ns, cost)
      );
    }
  });
}
