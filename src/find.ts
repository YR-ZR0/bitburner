/**
 * find prints out the terminal commands to connect to a host using {@link common.mapout}
 * @module
 */
import { NS } from "@ns";
import { mapout } from "./common";

export function autocomplete(data: {
  flags: (flag: string[][]) => void;
  servers: string[];
}) {
  data.flags([["target"]]);
  return [...data.servers];
}

/** @param {NS} ns */
export async function main(ns: NS) {
  const data = ns.flags([["target", ""]]);
  const result = mapout(ns, data.target as string);
  ns.tprint(result);
}
