import { NS } from "@ns";

/** @param {NS} ns */
export async function main(ns: NS) {
  ns.disableLog("ALL");
  // eslint-disable-next-line no-constant-condition
  while (true) {
    ns.printf("Your karma is: %s", ns.formatNumber(ns.heart.break()));
    await ns.sleep(300);
    ns.clearLog();
  }
}
