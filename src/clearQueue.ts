/**
 * clearQueue isa quick debug to flush a port of data
 */
import { NS } from "@ns";

export function autocomplete(data: {
  flags: (flags: string[][]) => string[][];
}) {
  return [data.flags([["targetPort"]])];
}

/** @param {NS} ns */
export async function main(ns: NS) {
  const data = ns.flags([["targetPort", 0]]);
  const port = ns.getPortHandle(data.targetPort as number);
  port.clear();
}
