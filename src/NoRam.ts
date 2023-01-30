/**
 * Noram reads the list of machines marked as having no usable ram
 * and attacks them with a basic attack loop
 */
import { NS } from "@ns";
import { maxCopies } from "common";

async function decide(ns: NS, host: string) {
  const chance = ns.hackAnalyzeChance(host);
  ns.print(chance);
  ns.print(host);
  if (chance !== 1) {
    ns.printf("Weakening host %s", host);
    await ns.weaken(host);
  }
  await ns.hack(host);
  await ns.grow(host);
}

/** @param {NS} ns */
export async function main(ns: NS) {
  const noRam = ns.read("NoRam.txt").split("\n");
  // eslint-disable-next-line no-constant-condition
  while (true) {
    for (const line in noRam) {
      const host = noRam[line];
      if (host !== "") {
        await decide(ns, host);
      } else {
        ns.print("Empty line detected. Skipping...");
      }
    }
  }
}
