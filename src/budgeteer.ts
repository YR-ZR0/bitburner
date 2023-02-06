/**
 * Budgeteer enforces global budgets on all buying apps e.g gangmanager, netupgrade
 *
 */

import { NS } from "@ns";

/**
 * Ideally we write a json dict on home and set a KV pair for each app
 * the retool each app to read this
 *
 * each budget should be a slice of the current money e.g.
 * stocks: 1000
 * netup: 1000
 * would result in netup and stocks only having 1000 each to play with
 * We should have a workflow for entering / adjusting these the writing the keys to a file
 */

/** @param {NS} ns */
export async function main(ns: NS) {
  const apps = ["net", "stocks", "gang"];
  const vals = new Map();
  let fileResults: Record<string, number | string> = {};
  if (ns.fileExists("budgets.txt")) {
    const budgetsExist: string = ns.read("budgets.txt");
    fileResults = JSON.parse(budgetsExist);
  }
  for (let item = 0; item < apps.length; item++) {
    const element = apps[item];
    const question = fileResults[element]
      ? ns.sprintf("Key %s with value %s", element, fileResults[element])
      : ns.sprintf("Key %s", element);

    const thing = await ns.prompt(question, {
      type: "text",
    });
    vals.set(element, thing);
  }
  const final = JSON.stringify(Object.fromEntries(vals));
  ns.write("budgets.txt", final, "w");
}
