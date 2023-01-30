/**
 * A simple share script that can be handed to odin manager
 */
import { NS } from "@ns";
/** @param {NS} ns */
export async function main(ns: NS) {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    await ns.share();
  }
}
