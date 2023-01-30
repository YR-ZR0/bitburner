// aggressive.ts
/**
 * Aggressive runs the  a hacking loop forever. it also calls {@link common.maxCopies} to figure out how many threads you should attack with
 * @module aggressive
 * @example
 * ```
 * run aggressive -t 200 --target n00dles
 * ```
 */
import { maxCopies } from "common";
import { NS } from "@ns";

export function autocomplete(data: {
  flags: (arg0: string[][]) => void;
  servers: string[];
}): string[] {
  data.flags([["target"]]);
  return [...data.servers];
}

/** @param {NS} ns */
export async function main(ns: NS) {
  const data = ns.flags([["target", ""]]);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const max = maxCopies(ns, ns.getRunningScript()!.filename, ns.getHostname());
  ns.tprint(max);
  // eslint-disable-next-line no-constant-condition
  while (true) {
    await ns.hack(data.target.toString());
    await ns.grow(data.target.toString());
    await ns.weaken(data.target.toString());
  }
}
