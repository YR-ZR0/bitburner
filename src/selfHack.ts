/**
 * selfHack is a function that is ran on a breached host. it takes no args.
 * @module
 * @remarks
 * selfHack basically automates early game hacking when combined with {@link ripntear} it allows fast iteration over hosts that can be breached.
 * IT also calls back to {@link listen} to send statstics about the breached host see {@link StatPayload}
 */

import { NS } from "@ns";
import { decider } from "common";

/** @param {NS} ns */
export async function main(ns: NS) {
  ns.disableLog("ALL");

  const moneyThres = 700000;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    await decider(ns, moneyThres, true, true);
  }
}
