/**
 * @module lategame/workhard
 * Sets up homicide and waits until we hit -54000 for gangs
 */

import { NS } from "@ns";

/** @param {NS} ns */
export async function main(ns: NS) {
  ns.disableLog("ALL");
  let karma = 0;
  if (karma > -54000) {
    ns.singularity.commitCrime("Homicide", false);
  }
  while (karma > -54000) {
    karma = ns.heart.break();
    ns.printf("Your karma is: %s", ns.formatNumber(karma));
    await ns.sleep(300);
    ns.clearLog();
  }
}
