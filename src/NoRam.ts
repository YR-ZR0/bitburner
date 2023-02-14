/**
 * Noram reads the list of machines marked as having no usable ram
 * and attacks them with a basic attack loop
 */
import { NS } from "@ns";
import { decider } from "common";

/** @param {NS} ns */
export async function main(ns: NS) {
  const noRam = ns.read("NoRam.txt").split("\n");
  // eslint-disable-next-line no-constant-condition
  while (true) {
    for (const line in noRam) {
      const host = noRam[line];
      if (host !== "") {
        await decider(ns, 7000000, true, false, host);
      }
    }
  }
}
