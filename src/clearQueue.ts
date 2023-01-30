/**
 * clearQueue isa quick debug to flush a port of data
 */
import { NS } from "@ns";

/** @param {NS} ns */
export async function main(ns: NS) {
  const port = ns.getPortHandle(1);
  port.clear();
}
