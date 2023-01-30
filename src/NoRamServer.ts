/**
 * Noramserver is made to be sent to a odin instance to kick off attacking instances that are marked to have noram
 */

import { maxCopies } from "common";
import { NS } from "@ns";

/** @param {NS} ns */
export async function main(ns: NS) {
  const target: string = ns.getHostname();
  ns.scp(["NoRam.txt", "NoRam.js"], target as string, "home");
  const max = maxCopies(ns, "NoRam.js", target as string);
  ns.spawn("NoRam.js", max);
}
