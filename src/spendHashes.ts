/**
 * Spends your hashes on a selected upgrade
 * */

import { NS } from "../NetscriptDefinitions";

/**
 * Spends youur hacknet hashes on the selected upgrade
 * @param {NS} ns */
export async function main(ns: NS) {
  let bought = false;
  const ups = ns.hacknet.getHashUpgrades();
  const choice = (await ns.prompt("Which upgrade", {
    type: "select",
    choices: ups,
  })) as string;
  const hashbal = ns.hacknet.numHashes();
  const hashcost = ns.hacknet.hashCost(choice);
  const re = new RegExp("[cC]orporation|[cC]ompany", "gm");
  const isCorp = re.exec(choice);
  if (!isCorp) {
    bought = ns.hacknet.spendHashes(choice, hashbal / hashcost);
  } else {
    const corpName = ns.corporation.getCorporation().name;
    bought = ns.hacknet.spendHashes(choice, corpName, hashbal / hashcost);
  }
  ns.print(bought);
}
