/**
 * checkPurchase lets to figure out the max amount of servers you can buy from each class based on current money
 * @module checkPurchase
 *
 */

import { NS } from "@ns";

async function build(ns: NS) {
  const max = ns.getPurchasedServerMaxRam();
  let i = 1;
  let result = 0;
  const serverList = new Map<number, number>();
  do {
    result = Math.pow(2, i);
    const cost = ns.getPurchasedServerCost(result);
    serverList.set(result, cost);
    await ns.sleep(200);
    i++;
  } while (result < max);
  return serverList;
}

/** @param {NS} ns */
export async function main(ns: NS) {
  const currentMoney = ns.getPlayer().money;
  const calculated = await build(ns);
  // ns.tprint(calculated.values());
  calculated.forEach((cost: number, element: number) => {
    if (currentMoney / cost >= 1) {
      ns.tprintf(
        "Ram %d can be bought %d times with cost %s",
        element,
        currentMoney / cost,
        ns.nFormat(cost, "$0.00a")
      );
    }
  });
}
