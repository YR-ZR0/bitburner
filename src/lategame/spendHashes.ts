import { NS } from "@ns";

/** @param {NS} ns */
export async function main(ns: NS) {
  const hashbal = ns.hacknet.numHashes();
  const hashcost = ns.hacknet.hashCost("Sell for Money");
  ns.hacknet.spendHashes("Sell for Money", "", hashbal / hashcost);
}
