// aggressive.ts
/**
 * Aggressive runs the  a hacking loop forever. it also calls {@link common.maxCopies} to figure out how many threads you should attack with
 * @module aggressive
 * @example
 * ```
 * run aggressive -t 200 --target n00dles
 * ```
 */
import { decider, maxCopies } from "common";
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
  const moneyThres = 70000000;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    await decider(ns, moneyThres, true, false, data.target as string);
  }
}
