import { NS } from "../NetscriptDefinitions";

/** @param {NS} ns */
export async function main(ns: NS) {
  ns.disableLog("ALL");
  while (true) {
    if (ns.hacknet.hashCapacity() == ns.hacknet.numHashes()) {
      ns.hacknet.spendHashes("Sell for Money", undefined, 1);
    }
    await ns.sleep(5000);
  }
}
